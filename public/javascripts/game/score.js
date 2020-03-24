/*
*   The Score class manage the score panel. It has to maintain the player list and refresh score during the game
*/
define(function () {
  // Defines
  const DELAY_BETWEEN_BONUSES = 1200;

  /*
  *   Constructor
  */
  function Score () {}

  /*
  * On new player list received
  * @param: {Array}  playerList   Array of players
  */
  Score.prototype.UpdatePlayerList = function(playerList) {
    const scoreNode = document.getElementById('gs-scores');

    // Reset old player score div
    scoreNode.innerHTML = '';

    for (let i = 0; i < playerList.length; i++) {
      if (playerList[i].monster)
        scoreNode.innerHTML += `
<article id="player${playerList[i].id}" class="playerScore">
    <div class="score-bar" style="background-color: ${playerList[i].monster.color}; display: none">
    </div>
    <img src="${playerList[i].monster.path}">
    <footer>
       <h3>${playerList[i].nick}</h3>
       <strong>${playerList[i].score} points</strong>
       <span>${playerList[i].nbWords} mots</span>
    </footer>
</article>`;
    }
  };

  /*
  * When a player scores, we have to refresh his infos ! 
  * @param: {Array}  playerList   Array of players
  */
  Score.prototype.RefreshScore = function(scoreObj) {
    const scoreNode = document.getElementById('player' + scoreObj.playerID);

    if (!scoreNode) {
      return;
    }

    // Update score and nb words
    document.querySelector('#player' + scoreObj.playerID + ' > footer > strong').innerHTML = scoreObj.score + ' points';
    document.querySelector('#player' + scoreObj.playerID + ' > footer > span').innerHTML = scoreObj.words + ' mots';

    let animationDelay = 0;
    for (let i = 0; i < scoreObj.bonus.length; i++) {
      // Create bonus text node
      const bonusNode = document.createElement('span');
      bonusNode.className = 'bonus';

      // Adding delay before apparition for multiple bonuses
      bonusNode.style.cssText = 'animation-delay: ' + animationDelay + 'ms;';
      bonusNode.innerHTML = scoreObj.bonus[i].title + '<br/>+ ' + scoreObj.bonus[i].points + ' pts';
      
      // Add event listener on animation end to properly remove the node
      bonusNode.addEventListener('animationend', function (event) {
        // Remove node when animation ends
        scoreNode.removeChild(event.srcElement);
      }, false);

      // Adding bonus in DOM and increase delay before the next bonus
      document.getElementById('ig-infos').appendChild(bonusNode);
      animationDelay += DELAY_BETWEEN_BONUSES;
    }
  };

  /*
  * Reset player's score to prepare for a ne game
  * @param: {Array}  playerList   Array of players
  */
  Score.prototype.resetScores = function() {
    const scoreNodes = document.querySelectorAll('.playerScore');

    for (let i = 0; i < scoreNodes.length; i++) {
      // Reset score bar
      scoreNodes[i].querySelector('div').style.height = '0%';

      // Update score and nb words
      scoreNodes[i].querySelector('footer > strong').innerHTML = '0 points';
      scoreNodes[i].querySelector('footer > span').innerHTML = '0 mots';
    }
  };

  return Score;
});
