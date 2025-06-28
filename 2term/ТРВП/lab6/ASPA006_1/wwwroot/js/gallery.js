document.addEventListener('DOMContentLoaded', function () {
    const imageFiles = [
        'Babbage.jpg',
        'Berners-Lee.jpg',
        'Chomsky.jpg',
        'Codd.jpg',
        'Dijkstra.jpg',
        'Einstein.jpg',
        'Ershov.jpg',
        'Huntington.jpg',
        'Knuth.jpg',
        'Linus.jpg',
        'Lovelace.jpg',
        'Neumann.jpg',
        'Tanenbaum.jpg'
    ];

    const gallery = document.getElementById('gallery');
    const baseUrl = 'http://localhost:5050/api/Celebrities/photo/';
    const eventsContainer = document.createElement('div');
    eventsContainer.id = 'events-container';
    document.body.appendChild(eventsContainer);

    fetch('http://localhost:5050/api/Celebrities')
        .then(response => response.json())
        .then(celebrities => {
            imageFiles.forEach(file => {
                // Find matching celebrity for this image
                const celebrity = celebrities.find(c => c.reqPhotoPath === file);
                if (!celebrity) return;

                const card = document.createElement('div');
                card.className = 'celebrity';

                const img = document.createElement('img');
                img.src = baseUrl + file;
                img.alt = celebrity.fullName;

                const name = document.createElement('h3');
                name.textContent = celebrity.fullName;

                card.addEventListener('click', () => {
                    fetch(`http://localhost:5050/api/Lifeevents/Celebrities/${celebrity.id}`)
                        .then(response => response.json())
                        .then(events => {
                            eventsContainer.innerHTML = `<h2>Life Events for ${celebrity.fullName}</h2>`;

                            if (events.length === 0) {
                                eventsContainer.innerHTML += '<p>No events found</p>';
                                return;
                            }

                            const list = document.createElement('ul');
                            events.forEach(event => {
                                const item = document.createElement('li');
                                const date = new Date(event.date).toLocaleDateString();
                                item.textContent = `${date}: ${event.description}`;
                                list.appendChild(item);
                            });
                            eventsContainer.appendChild(list);
                        })
                        .catch(error => {
                            console.error('Error fetching events:', error);
                            eventsContainer.innerHTML = '<p>Error loading events</p>';
                        });
                });

                card.appendChild(img);
                card.appendChild(name);
                gallery.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching celebrities:', error);
            gallery.innerHTML = '<p>Error loading celebrities</p>';
        });
});