Title: this is "matching-game" schema.

Feature Tasks:

wireframe: 4 pages: user splash page, feature game (theme), About-us, (game-score)

flow charts:

Page Requirement:
1) user splash page:
   login/sign-up
   A) function new user  (name, password){
      , navigate to feature game page,
      userArray = [];}

      function name (name, password){
        this.name;
        this.password;
        this.score;
        game-status = render state of table from previous session = [];
        userArray.push(this);
        this.active = true;
      }

      eventHandler function (){
        set active status;
        localStorage(if not true, set localStorage);
        go to another html page;
}

  B) function repeat user: retrieve and verify localStorage array (name, password) {
    game-status = render state of table from previous session
    }

      eventHandler function (){
      if validation fails, return alert;

      set active status;
      update localStorage (setItem);
      game-status = render state of table from previous session = [];
      navigate to feature game page;
    }

2) Feature game:

A) instruction (one user);
    eventHandler singleUser button ()
    {userPrompt(how many squares do you want?)
     for initial build, we only input "4"
     alert (verify if number square = 2 || 4 || 6 || 8);
   }

  cardArray = [ 32 images, faceup_card, shown_card];

B) set up number of card instances based on number of squares (numSquares){
  this.name;
  this.imgLocation;
  this.face up = false;
  this.location;
  game-level = numSquares;
  this.removed = false;
  cardArray.push(this);
  }

C) function render table(set up number of squares {
    (for initial build, set up 4 x 4 pairs/grid, increase difficulties with more squares), each square with id("x,y")) ()};

D) function random generator for card location (){
    rules TBD;
    };

E) function render card (cardArray[i].location, render table){


    }

    numClick = 0;
F) evenHandler for clicking one of the squares function (click) {
      alert(for not clicking card);
    query card,
    if first click, flip card(imglocation)/card.faceup = true, numClick += 1;
    if second click, flip second card(imglocation)/card.faceup = true, timeDelay, if match, remove card from table;
      render cards(); this.removed = true} else
      { flip both cards, set both first and second card.faceup = false, render cards();
        }
    }

F) score object(boardSquare):{
    this.squares = boardSquares;
    this.SessionDuration(getStartTime,getStopTime);
  }

3) About-us:
add team-member bio;
