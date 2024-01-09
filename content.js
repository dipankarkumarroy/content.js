function content(file){
        // Fetch articles from external JSON file
        fetch(file)
            .then(response => response.json())
            .then(articles => {
                const articleSection = document.getElementById('articleSection');

                // Get the article title from the URL parameters
                const urlParams = new URLSearchParams(window.location.search);
                const articleTitle = urlParams.get('article');

                if (articleTitle) {
                    // Filter the articles array to find the selected article
                    const selectedArticle = articles.find(article => article.title === articleTitle);

                    if (selectedArticle) {
                        const articleElement = document.createElement('reader');
                        articleElement.innerHTML = `
                            <br>
                            <div class='HeadImg'><img src="${selectedArticle.image}" alt="${selectedArticle.title} Image"></div>
                            <h2>${selectedArticle.title}</h2>
                            <p>${selectedArticle.content}</p>
                            <div id="contentContainer"></div>
                        `;
                        url=selectedArticle.extra
                         // Fetch HTML content from the link
                         if(url)
                          fetch(url)
                            .then(response => response.text())
                            .then(htmlContent => {
                          // Insert the HTML content into the div with id 'contentContainer'
                              document.getElementById('contentContainer').innerHTML = htmlContent;
                            })
                            .catch(error => console.error('Error fetching HTML content:', error));

                        articleSection.appendChild(articleElement);
                    } else {
                        // Handle case when the specified article is not found
                        const errorMessage = document.createElement('p');
                        errorMessage.textContent = 'Article not found';
                        articleSection.appendChild(errorMessage);
                    }
                } else {
                    // Display all articles
                    articles.forEach(article => {
                        const articleElement = document.createElement('article');
                        const maxWords = 10;
                        const articleContent = article.content;
                        var content=articleContent
                        if (articleContent.length > maxWords) {
                            const truncatedContent = articleContent.split(' ').slice(0, maxWords).join(' ');
                            content=truncatedContent
                        }

                        articleElement.innerHTML = `
                            <img src="${article.image}" alt="${article.title} Image">
                            <h2>${article.title}</h2>
                            <p>${content}....</p>
                        `;
                        // Add a click event listener to each article
                articleElement.addEventListener('click', () => {
                    // Redirect to the detailed view for the clicked article
                    window.location.href = `?article=${encodeURIComponent(article.title)}`;
                });
                        articleSection.appendChild(articleElement);
                    });
                }
            })
            .catch(error => console.error('Error fetching articles:', error));
        }
