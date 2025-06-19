document.addEventListener('DOMContentLoaded', function() {

    const isAuthPage = document.body.classList.contains('auth-page');
    const isInfoPage = document.getElementById('news-container') && document.getElementById('server-status-container');
    
    const authContainer = document.querySelector('.nav-menu');

    const updateAuthUI = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!authContainer) return;

        const oldAuthLink = authContainer.querySelector('.auth-link-item');
        if (oldAuthLink) oldAuthLink.remove();
        
        const authLi = document.createElement('li');
        authLi.className = 'auth-link-item';

        if (user) {

            authLi.innerHTML = `
                <i class="fas fa-user-circle profile-icon" title="Мій профіль" style="font-size: 24px; color: white; cursor: pointer; margin-right: 15px;"></i>
                <button class="logout-btn nav-btn" style="background-color: #ff3333;">Вийти</button>
            `;
            authContainer.appendChild(authLi);

            authLi.querySelector('.profile-icon').addEventListener('click', () => {

                let profileModal = document.getElementById('profileModal');
                if (!profileModal) {
                    profileModal = document.createElement('div');
                    profileModal.id = 'profileModal';
                    profileModal.className = 'modal';
                    document.body.appendChild(profileModal);
                }
                
                profileModal.innerHTML = `
                    <div class="modal-content">
                        <span class="close-button">&times;</span>
                        <h2>Профіль користувача</h2>
                        <div>
                            <p><strong>Ім'я:</strong> <span id="profileUsername">${user.username}</span></p>
                            <p><strong>Email:</strong> <span id="profileEmail">${user.email}</span></p>
                            <p><strong>Дата реєстрації:</strong> <span id="profileRegDate">${new Date(user.created_at).toLocaleString('uk-UA')}</span></p>
                        </div>
                    </div>`;

                profileModal.style.display = 'block';
                profileModal.querySelector('.close-button').onclick = () => profileModal.style.display = 'none';
                window.onclick = (event) => { if (event.target == profileModal) profileModal.style.display = 'none'; };
            });

            authLi.querySelector('.logout-btn').addEventListener('click', () => {
                localStorage.removeItem('user');
                window.location.reload();
            });

        } else {

            authLi.innerHTML = `<a href="AutReg.html" class="auth-link nav-btn">Вхід</a>`;
            authContainer.appendChild(authLi);
        }
    };
    
    if (isAuthPage) {
        // --- ЛОГИКА ДЛЯ СТРАНИЦЫ АВТОРИЗАЦИИ (AutReg.html) ---
        const loginToggle = document.getElementById('loginToggle');
        const registerToggle = document.getElementById('registerToggle');
        const loginFormContainer = document.getElementById('loginForm');
        const registerFormContainer = document.getElementById('registerForm');
        
        const toggleForms = (formType) => {
            const wave = document.querySelector('.wave');
            loginFormContainer.classList.toggle('active', formType === 'login');
            registerFormContainer.classList.toggle('active', formType !== 'login');
            loginToggle.classList.toggle('active', formType === 'login');
            registerToggle.classList.toggle('active', formType !== 'login');
            wave.classList.toggle('to-login', formType === 'login');
            wave.classList.toggle('to-register', formType !== 'login');
        };
        loginToggle.addEventListener('click', () => toggleForms('login'));
        registerToggle.addEventListener('click', () => toggleForms('register'));

        const loginFormElement = document.querySelector('#loginForm form');
        loginFormElement.addEventListener('submit', async function(event) {
            event.preventDefault();
            const email = loginFormElement.querySelector('#email').value;
            const password = loginFormElement.querySelector('#password').value;
            try {
                const response = await fetch('login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Невідома помилка сервера');
                localStorage.setItem('user', JSON.stringify(data.user));
                alert(data.message);
                window.location.href = 'index.html';
            } catch (error) {
                alert('Помилка входу: ' + error.message);
            }
        });

        const registerFormElement = document.querySelector('#registerForm form');
        registerFormElement.addEventListener('submit', async function(event) {
            event.preventDefault();
            const username = registerFormElement.querySelector('#username').value;
            const email = registerFormElement.querySelector('#email').value;
            const password = registerFormElement.querySelector('#password').value;
            try {
                const response = await fetch('register.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Невідома помилка сервера');
                alert(data.message);
                toggleForms('login');
            } catch (error) {
                alert('Помилка реєстрації: ' + error.message);
            }
        });
    } else if (isInfoPage) {
        // --- ЛОГИКА ДЛЯ СТРАНИЦЫ ИНФОРМАЦИИ (Information.html) ---
        const newsContainer = document.getElementById('news-container');
        const newsLoadingIndicator = document.getElementById('loading-indicator');
        const loadMoreSteamNewsBtn = document.getElementById('loadMoreSteamNews');

        let allSteamNews = [];
        let displayedSteamNewsCount = 0;
        const STEAM_NEWS_PER_PAGE = 6;

        const renderSteamNews = () => {
            const newsToRender = allSteamNews.slice(displayedSteamNewsCount, displayedSteamNewsCount + STEAM_NEWS_PER_PAGE);
            
            newsToRender.forEach(item => {
                const newsElement = document.createElement('div');
                newsElement.className = 'news-card';
                newsElement.innerHTML = `
                    <a href="${item.link}" target="_blank" rel="noopener noreferrer">
                        <img src="${item.image}" alt="${item.title}" onerror="this.style.display='none'">
                    </a>
                    <div class="news-card-content">
                        <h3><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a></h3>
                        <p>${item.snippet}</p>
                        <div class="news-card-footer">
                            <span>${item.date}</span>
                        </div>
                    </div>
                `;
                newsContainer.appendChild(newsElement);
            });

            displayedSteamNewsCount += newsToRender.length;
            
            if (loadMoreSteamNewsBtn) {
                loadMoreSteamNewsBtn.style.display = displayedSteamNewsCount >= allSteamNews.length ? 'none' : 'block';
            }
        };

        fetch('steam_news.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(newsItems => {
                newsLoadingIndicator.style.display = 'none';
                if (newsItems && newsItems.length > 0 && !newsItems.error) {
                    allSteamNews = newsItems;
                    renderSteamNews();
                } else {
                    newsContainer.innerHTML = `<p>${newsItems.error || 'Не удалось загрузить новости из Steam.'}</p>`;
                }
            })
            .catch(error => {
                console.error('Fetch error for news:', error);
                newsLoadingIndicator.style.display = 'none';
                newsContainer.innerHTML = '<p>Ошибка при загрузке новостей. Попробуйте позже.</p>';
            });

        if(loadMoreSteamNewsBtn) {
            loadMoreSteamNewsBtn.addEventListener('click', renderSteamNews);
        }

        const statusContainer = document.getElementById('server-status-container');
        const statusLoadingIndicator = document.getElementById('status-loading-indicator');
        const steamApiUrl = 'steam_status.php';

        fetch(steamApiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok for Server Status');
                }
                return response.json();
            })
            .then(data => {
                statusLoadingIndicator.style.display = 'none';
                const services = data.result && data.result.services;
                if (services) {
                    for (const [serviceName, serviceStatus] of Object.entries(services)) {
                        const statusCard = document.createElement('div');
                        statusCard.className = 'server-status-card';
                        
                        const statusClass = (serviceStatus || 'unknown').toLowerCase();

                        statusCard.innerHTML = `
                            <h4>${serviceName}</h4>
                            <span class="status ${statusClass}">${serviceStatus}</span>
                        `;
                        statusContainer.appendChild(statusCard);
                    }
                } else {
                    statusContainer.innerHTML = `<p>${data.error || 'Не удалось получить данные о статусе серверов.'}</p>`;
                }
            })
            .catch(error => {
                console.error('Fetch error for server status:', error);
                statusLoadingIndicator.style.display = 'none';
                statusContainer.innerHTML = '<p>Ошибка при загрузке статуса серверов. Попробуйте позже.</p>';
            });

    } else {
        // --- ЛОГИКА ДЛЯ ГЛАВНОЙ СТРАНИЦЫ (index.html) ---
        // --- НАЧАЛО ИЗМЕНЕНИЙ ---
        const newsGrid = document.querySelector('.news-grid');
        const loadMoreNewsBtn = document.getElementById('loadMoreNews');
        if (newsGrid && loadMoreNewsBtn) {
            let allNews = [];
            let displayedNewsCount = 0;
            const NEWS_PER_PAGE = 6; 

            const renderNews = () => {
                const newsToRender = allNews.slice(displayedNewsCount, displayedNewsCount + NEWS_PER_PAGE);
                newsToRender.forEach(item => {
                    const newsElement = document.createElement('div');
                    // ПРИМЕНЯЕМ КЛАСС 'news-card'
                    newsElement.className = 'news-card';
                    // ИЗМЕНЯЕМ СТРУКТУРУ HTML, ЧТОБЫ СООТВЕТСТВОВАТЬ СТИЛЮ
                    // (Так как у этих новостей нет картинки, блок с <img> опущен)
                    newsElement.innerHTML = `
                        <div class="news-card-content">
                            <h3><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a></h3>
                            <p>${item.description}</p>
                            <div class="news-card-footer">
                                <span>Опубліковано: ${new Date(item.time).toLocaleString('uk-UA')}</span>
                            </div>
                        </div>
                    `;
                    newsGrid.appendChild(newsElement);
                });
                displayedNewsCount += newsToRender.length;
                loadMoreNewsBtn.style.display = displayedNewsCount >= allNews.length ? 'none' : 'block';
            };

            fetch('news.php')
                .then(response => response.json())
                .then(newsItems => {
                    if (newsItems && !newsItems.error) {
                        allNews = newsItems;
                        renderNews();
                    }
                }).catch(err => console.error("Fetch news error:", err));
            loadMoreNewsBtn.addEventListener('click', renderNews);
        }
        // --- КОНЕЦ ИЗМЕНЕНИЙ ---

        const matchesSection = document.querySelector('.matches-section');
        if (matchesSection) {
            let allMatches = { past: [], ongoing: [], future: [] };
            const MATCHES_PER_PAGE = 5;

            const createMatchElement = (match) => {
                const team1 = match.teams[0] || { name: 'TBD', logo: '' };
                const team2 = match.teams[1] || { name: 'TBD', logo: '' };
                const element = document.createElement('div');
                element.className = 'match';
                element.innerHTML = `
                    <h4>${match.event.name}</h4>
                    <p>
                        <img src="${team1.logo || 'photos/default-logo.png'}" alt="${team1.name}" class="match-team-logo" style="width:25px; height:auto; vertical-align:middle; margin-right: 8px;" onerror="this.src='photos/default-logo.png'">
                        <strong>${team1.name}</strong> vs <strong>${team2.name}</strong>
                        <img src="${team2.logo || 'photos/default-logo.png'}" alt="${team2.name}" class="match-team-logo" style="width:25px; height:auto; vertical-align:middle; margin-left: 8px;" onerror="this.src='photos/default-logo.png'">
                    </p>
                    <p>Час: ${new Date(match.time).toLocaleString('uk-UA')}</p>
                    <p>Формат: ${match.maps.toUpperCase()}</p>
                `;
                return element;
            };

            const renderMatchesForCategory = (categoryKey) => {
                const container = document.getElementById(categoryKey);
                const button = document.getElementById(`show-more-${categoryKey}`);
                if (!container) return;

                if (!container.dataset.page) container.dataset.page = '0';

                let category;
                switch (categoryKey) {
                    case 'current-matches':
                        category = 'future';
                        break;
                    case 'ongoing-matches':
                        category = 'ongoing';
                        break;
                    case 'past-matches':
                        category = 'past';
                        break;
                    default:
                        category = 'future';
                }
                
                const matches = allMatches[category] || [];
                let currentPage = parseInt(container.dataset.page);

                if (currentPage === 0 && matches.length === 0) {
                    const noMatchesHTML = '<p style="text-align: center; padding: 20px;">На жаль, зараз матчів немає</p>';
                    container.insertAdjacentHTML('afterbegin', noMatchesHTML);
                    button.style.display = 'none';
                    return;
                }
                
                const startIndex = currentPage * MATCHES_PER_PAGE;
                const matchesToRender = matches.slice(startIndex, startIndex + MATCHES_PER_PAGE);
                
                matchesToRender.forEach(match => button.insertAdjacentElement('beforebegin', createMatchElement(match)));
                
                container.dataset.page = currentPage + 1;
                
                const newStartIndex = (currentPage + 1) * MATCHES_PER_PAGE;
                if (button) {
                    button.style.display = newStartIndex >= matches.length ? 'none' : 'block';
                }
            };
            
            fetch('matches.php')
                .then(response => response.json())
                .then(matches => {
                    const now = new Date();
                    const threeHoursAgo = new Date(now.getTime() - (3 * 60 * 60 * 1000));

                    matches.forEach(match => {
                        const matchTime = new Date(match.time);
                        if (matchTime < threeHoursAgo) {
                            allMatches.past.push(match);
                        } else if (matchTime >= threeHoursAgo && matchTime <= now) {
                            allMatches.ongoing.push(match);
                        } else {
                            allMatches.future.push(match);
                        }
                    });

                    allMatches.future.sort((a,b) => new Date(a.time) - new Date(b.time));
                    allMatches.ongoing.sort((a,b) => new Date(a.time) - new Date(b.time));
                    allMatches.past.sort((a,b) => new Date(b.time) - new Date(a.time));
                    
                    renderMatchesForCategory('current-matches');

                    document.getElementById('show-more-current-matches').addEventListener('click', () => renderMatchesForCategory('current-matches'));
                    document.getElementById('show-more-ongoing-matches').addEventListener('click', () => renderMatchesForCategory('ongoing-matches'));
                    document.getElementById('show-more-past-matches').addEventListener('click', () => renderMatchesForCategory('past-matches'));

                }).catch(err => console.error("Fetch matches error:", err));

            document.querySelectorAll('.tab-button').forEach(tab => {
                tab.addEventListener('click', () => {
                    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
                    tab.classList.add('active');
                    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                    
                    const targetContent = document.getElementById(tab.dataset.tab);
                    targetContent.classList.add('active');
                    
                    if (!targetContent.dataset.page || targetContent.dataset.page === '0') {
                        renderMatchesForCategory(tab.dataset.tab);
                    }
                });
            });
        }

        const playersSection = document.querySelector('.players-section');
        if (playersSection) {
            const playersGrid = playersSection.querySelector('.players-grid');
            const nextTeamBtn = playersSection.querySelector('.team-view-btn');
            const teamNameHeading = document.getElementById('team-name-heading');
            const teamLogoImg = playersSection.querySelector('.team-logo');
            let teamsData = [];
            let currentTeamIndex = 0;

            const renderTeam = (index) => {
                if (!teamsData || teamsData.length === 0) return;
                const team = teamsData[index];
                playersGrid.innerHTML = '';
                teamNameHeading.textContent = `Склад команди: ${team.name}`;
                
                teamLogoImg.src = team.logo;
                teamLogoImg.style.display = 'block';
                teamLogoImg.style.width = '60px';
                teamLogoImg.style.height = '60px';
                teamLogoImg.style.objectFit = 'contain';
                teamLogoImg.style.margin = '0 auto 1rem';

                team.players.forEach(player => {
                    const playerElement = document.createElement('div');
                    playerElement.className = 'player';
                    playerElement.innerHTML = `
                        <img src="${player.image}" alt="${player.nickname}" class="player-photo" onerror="this.src='photos/default-logo.png'">
                        <div class="player-info">
                            <p class="player-nick">${player.nickname}</p>
                            <a href="https://www.hltv.org/search?query=${player.nickname}" target="_blank" class="player-link">HLTV Profile</a>
                        </div>`;
                    playersGrid.appendChild(playerElement);
                });
            };

            fetch('teams.php')
                .then(response => response.json())
                .then(data => {
                    if (data && !data.error) {
                        teamsData = data;
                        renderTeam(currentTeamIndex);
                    }
                }).catch(err => console.error("Fetch teams error:", err));
            nextTeamBtn.addEventListener('click', () => {
                if(teamsData.length > 0) {
                    currentTeamIndex = (currentTeamIndex + 1) % teamsData.length;
                    renderTeam(currentTeamIndex);
                }
            });
        }
        
        const subscribeForm = document.getElementById('subscribeForm');
        if(subscribeForm) {
            subscribeForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const emailInput = subscribeForm.querySelector('#subscribeEmail');
                try {
                    const response = await fetch('subscribe.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: emailInput.value })
                    });
                    const data = await response.json();
                    alert(data.message || data.error);
                    if (response.ok) emailInput.value = '';
                } catch (error) {
                    alert('Помилка підписки: ' + error.message);
                }
            });
        }
    }
    
    updateAuthUI();
});