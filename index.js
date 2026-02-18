
        // ==================== GLOBAL VARIABLES ====================
        let secretNumber;
        let attempts;
        let guessHistory;
        let bestScore;
        let gamesPlayed;

        // ==================== INITIALIZATION ====================
        $(document).ready(function() {
            loadGameData();
            initializeGame();
            setupEventListeners();
        });

        // ==================== GAME FUNCTIONS ====================
        
        function initializeGame() {
            secretNumber = Math.floor(Math.random() * 100) + 1;
            sessionStorage.setItem('secretNumber',secretNumber); 
            //when game initialize(or run for the first time) the secret number is generated and stored in the session storage and when new game starts the secret number of the session storage also changes
            attempts = 0;
            guessHistory = [];
            updateDisplay();
            $('#guessInput').val('').focus();
            $('#guessInput').prop('disabled', false);
            $('#submitGuess').prop('disabled', false);
            showMessage('Make your first guess!', 'info');
        }

        function checkGuess() {
            const guess = parseInt($('#guessInput').val());
            
            if (isNaN(guess)) {
                showMessage('Please enter a valid number!', 'error');
                return;
            }
            
            if (guess < 1 || guess > 100) {
                showMessage('Number must be between 1 and 100!', 'warning');
                return;
            }
            
            if (guessHistory.includes(guess)) {
                showMessage('You already guessed ' + guess + '!', 'warning');
                return;
            }
            
            attempts++;
            guessHistory.push(guess);
            
            if (guess === secretNumber) {
                handleWin();
            } else if (guess < secretNumber) {
                showMessage('📉 Too low! Try higher.', 'warning');
            } else {
                showMessage('📈 Too high! Try lower.', 'warning');
            }
            
            updateDisplay();
            $('#guessInput').val('').focus();
        }

        function handleWin() {
            showMessage('🎉 You won in ' + attempts + ' attempts!', 'success');
            gamesPlayed++;
            
            if (bestScore === null || attempts < bestScore) {
                bestScore = attempts;
            }
            
            saveGameData();
            updateDisplay();
            $('#guessInput').prop('disabled', true);
            $('#submitGuess').prop('disabled', true);
        }

        // ==================== SESSION STORAGE ====================
        
        function saveGameData() {
            sessionStorage.setItem('bestScore', bestScore);
            sessionStorage.setItem('gamesPlayed', gamesPlayed);
        }

        function loadGameData() {
            bestScore = sessionStorage.getItem('bestScore');
            gamesPlayed = sessionStorage.getItem('gamesPlayed');
            bestScore = bestScore ? parseInt(bestScore) : null;
            gamesPlayed = gamesPlayed ? parseInt(gamesPlayed) : 0;
        }

        function clearStatistics() {
            if (confirm('Clear all statistics?')) {
                sessionStorage.clear();
                bestScore = null;
                gamesPlayed = 0;
                guessHistory = []; //this clears the guessHistory array
                attempts=0;        //this clears the attempts            
                console.log(guessHistory.length);
                updateDisplay();
                showMessage('Statistics cleared!', 'info');
            }
        }

        // ==================== DISPLAY FUNCTIONS ====================
        
        function updateDisplay() {
            $('#attempts').text(attempts);
            $('#bestScore').text(bestScore !== null ? bestScore : '-');
            $('#gamesPlayed').text(gamesPlayed);
            displayGuessHistory();
        }

        function displayGuessHistory() {
            if (guessHistory.length === 0) {
                $('#historyList').text('None yet');
                return;
            }
            
            let historyHTML = '';
            for (let i = 0; i < guessHistory.length; i++) {
                historyHTML += '<span class="guess-item">' + guessHistory[i] + '</span>';
            }
            $('#historyList').html(historyHTML);
        }

        function showMessage(text, type) {
            const $message = $('#message');
            $message.removeClass('success error info warning');
            $message.addClass(type).text(text);
        }

        // ==================== EVENT HANDLERS ====================
        
        function setupEventListeners() {
            $('#submitGuess').click(function() {
                checkGuess();
            });
            
            $('#guessInput').keypress(function(event) {
                if (event.which === 13) {
                    checkGuess();
                }
            });
            
            $('#resetGame').click(function() {
                initializeGame();
            });
            
            $('#clearStats').click(function() {
                clearStatistics();
            });
        }