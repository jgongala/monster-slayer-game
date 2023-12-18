function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
    data() {
        // Initial data for the application
        return {
            playerHealth: 100,
            monsterHealth: 100,
            currentRound: 0,
            winner: null,
            logMessages: []
        };
    },

    computed: {
        // Computed properties for dynamic styling
        monsterBarStyles() {
            if (this.monsterHealth < 0) {
                return { width: 0 };
            }
            return { width: this.monsterHealth + '%' };
        },

        playerBarStyles() {
            if (this.playerHealth < 0) {
                return { width: 0 };
            }
            return { width: this.playerHealth + '%' };
        },

        mayUseSpecialAttack() {
            // Computed property to determine if special attack is allowed
            return this.currentRound % 3 !== 0;
        }
    },

    watch: {
        // Watchers to check for changes in health values
        playerHealth(value) {
            // Check for game results when player health changes
            if (value <= 0 && this.monsterHealth <= 0) {
                this.winner = 'draw';
            } else if (value <= 0) {
                this.winner = 'monster';
            }
        },

        monsterHealth(value) {
            // Check for game results when monster health changes
            if (value <= 0 && this.playerHealth <= 0) {
                this.winner = 'draw';
            } else if (value <= 0) {
                this.winner = 'player';
            }
        }
    },

    methods: {
        // Methods to perform various game actions
        attackMonster() {
            // Method for a regular attack on the monster
            this.currentRound++;
            const attackValue = getRandomValue(5, 12);
            this.monsterHealth = this.monsterHealth - attackValue;
            this.addLogMessage('player', 'attack', attackValue)
            this.attackPlayer();
        },

        attackPlayer() {
            // Method for the monster's counter-attack on the player
            const attackValue = getRandomValue(8, 15);
            this.playerHealth = this.playerHealth - attackValue;
            this.addLogMessage('monster', 'attack', attackValue)

        },

        specialAttackMonster() {
            // Method for a special attack on the monster
            this.currentRound++;
            const attackValue = getRandomValue(10, 25);
            this.monsterHealth = this.monsterHealth - attackValue;
            this.addLogMessage('player', 'special attack', attackValue)
            this.attackPlayer();
        },

        healPlayer() {
            // Method for the player to heal
            this.currentRound++;
            const healValue = getRandomValue(8, 20);
            if (this.playerHealth + healValue > 100) {
                this.playerHealth = 100;
            } else {
                this.playerHealth += healValue;
            }
            this.addLogMessage('player', 'heal', healValue)
            this.attackPlayer();
        },

        startGame() {
            // Method to reset the game to initial state
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.currentRound = 0;
            this.winner = null;
            this.logMessages = []
        },

        surrender() {
            // Method to surrender and declare the monster as the winner
            this.winner = 'monster';
        },

        addLogMessage(who, what, value) {
            // Method to display battle log
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value
            });
        }
    }
});

// Mount the Vue app to the specified HTML element
app.mount('#game');
