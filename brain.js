 tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        natureGreen: '#2e8b57',
                        natureGreenHover: '#236b43',
                        wikiBg: '#f6f6f6',
                        wikiBorder: '#a2a9b1',
                        wikiText: '#202122'
                    },
                    fontFamily: {
                        serif: ['Georgia', 'Times New Roman', 'serif'],
                        sans: ['Arial', 'Helvetica', 'sans-serif']
                    }
                }
            }
        }
        // Utility: Resize and compress image using Canvas
function resizeImage(file, maxWidth, maxHeight, callback) {
    const reader = new FileReader();
    
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions while keeping aspect ratio
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }

            // Draw image on canvas
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Convert back to a base64 string (JPEG, 80% quality)
            const resizedBase64 = canvas.toDataURL('image/jpeg', 0.8);
            callback(resizedBase64);
        };
        img.src = event.target.result;
    };
    
    // Start reading the file
    reader.readAsDataURL(file);
}
 const form = document.getElementById('flora-form');
        const container = document.getElementById('articles-container');
        const emptyState = document.getElementById('empty-state');

        // State Management
        let plants = JSON.parse(localStorage.getItem('algeriaFlora')) || [];

        // Helper: Get badge color based on category
        function getBadgeColor(category) {
            switch(category) {
                case 'Medical': return 'bg-red-100 text-red-800 border-red-200';
                case 'Nutritive': return 'bg-blue-100 text-blue-800 border-blue-200';
                case 'Aromatic': return 'bg-purple-100 text-purple-800 border-purple-200';
                default: return 'bg-gray-100 text-gray-800 border-gray-200';
            }
        }

        // Render Articles
        function renderArticles() {
            container.innerHTML = '';
            
            if (plants.length === 0) {
                emptyState.classList.remove('hidden');
            } else {
                emptyState.classList.add('hidden');
                
                plants.forEach((plant, index) => {
                    const card = document.createElement('div');
                    card.className = 'bg-white border border-wikiBorder shadow-sm flex flex-col h-full hover:shadow-md transition-shadow';
                    
                    card.innerHTML = `
                        <div class="h-48 overflow-hidden border-b border-wikiBorder relative">
                            <img src="${plant.image}" alt="${plant.name}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Found'">
                            <span class="absolute top-2 right-2 px-2 py-1 text-xs font-bold uppercase rounded-sm border shadow-sm ${getBadgeColor(plant.category)}">
                                ${plant.category}
                            </span>
                        </div>
                        <div class="p-4 flex-grow flex flex-col">
                            <h3 class="text-xl font-serif text-natureGreen mb-2 leading-tight">${plant.name}</h3>
                            <p class="text-sm text-gray-700 flex-grow mb-4 leading-relaxed">${plant.description}</p>
                            <div class="mt-auto border-t border-gray-100 pt-3 text-right">
                                <button onclick="deleteArticle(${index})" class="text-sm text-red-600 hover:text-red-800 hover:underline">
                                    [Delete]
                                </button>
                            </div>
                        </div>
                    `;
                    container.appendChild(card);
                });
            }
        }

        // Add Article with Image Resizing
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const fileInput = document.getElementById('image');
    const file = fileInput.files[0];

    if (file) {
        // Resize image to max 800x800 pixels before saving
        resizeImage(file, 800, 800, function(resizedImageData) {
            
            // Get form values
            const newPlant = {
                name: document.getElementById('name').value.trim(),
                category: document.getElementById('category').value,
                image: resizedImageData, // Save the resized base64 string instead of a URL
                description: document.getElementById('description').value.trim(),
            };

            // Update State & LocalStorage
            plants.unshift(newPlant);
            localStorage.setItem('algeriaFlora', JSON.stringify(plants));

            // Reset form and re-render
            form.reset();
            renderArticles();
        });
    }
});// Add Article with Image Resizing

            // Delete Article
        window.deleteArticle = function(index) {
            if(confirm('Are you sure you want to delete this article?')) {
                plants.splice(index, 1);
                localStorage.setItem('algeriaFlora', JSON.stringify(plants));
                renderArticles();
            }
        };

        // Initial Render
        renderArticles();