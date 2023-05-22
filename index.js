//시작화면
const startBox = document.getElementById("startBox");
//게임을 하는 곳
const gameArea = document.getElementById("gameArea");
//비행기
let airplane = document.querySelector("#airplane");

// 이동 값
let moveValue = 20;
const airplanewidth = 160;

let targetLeft = gameArea.getBoundingClientRect().left;
let targetRight = gameArea.getBoundingClientRect().right;

// 첫번째 배경
let img = document.getElementById("myImage");
let pos = 0;
let speed = 1.5;
// 두번째 배경
let img1 = document.getElementById("myImage1");
let pos1 = img.height;
let speed1 = 1.5;

// 게임시작 버튼 클릭 시
function startGame() {
  startBox.style.display = "none";
  moveImage();
  moveImage1();
  controlAirplane();
  const counting = document.getElementById("counting");
  let countValue = 3;
  counting.innerText = countValue;
  const countdown = setInterval(() => {
    countValue -= 1;
    counting.innerText = countValue;
    if (countValue === 0) {
      counting.style.display = "none";
      clearInterval(countdown);
      avoidObj();
      movemissile();
      bumpObj();
    }
  }, 1000);
}
let stopImg;
function moveImage() {
  pos += speed;
  img.style.top = pos + "px";
  if (pos >= window.innerHeight) {
    pos = -img.height;
  }
  stopImg = window.requestAnimationFrame(moveImage);
}
let stopImg1;
function moveImage1() {
  pos1 += speed1;
  img1.style.top = pos1 + "px";
  if (pos1 >= window.innerHeight) {
    pos1 = -img1.height;
  }
  stopImg1 = window.requestAnimationFrame(moveImage1);
}
function controlAirplane() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      let targetAirplane = airplane.getBoundingClientRect();
      let left;
      if (targetAirplane.x > targetLeft) {
        left = targetAirplane.x - moveValue;
        if (targetAirplane.x - moveValue < targetLeft) {
          left = targetLeft;
        }
        airplane.style.left = left + "px";
      }
    }
    if (event.key === "ArrowRight") {
      let targetAirplane = airplane.getBoundingClientRect();
      let right;
      if (targetAirplane.x < targetRight) {
        right = targetAirplane.x + moveValue;
        if (targetAirplane.x + moveValue + airplanewidth > targetRight) {
          right = targetRight - airplanewidth;
        }
        airplane.style.left = right + "px";
      }
    }
  });
}
// 19칸
//14칸중 랜덤으로 5칸이 붙은 빈칸으로 채우고 나머지는 미사일로 채우기
// // 장애물
const missileArea = document.querySelector(".missileArea");
const missileObj = { src: "img/missile.png" };
function avoidObj() {
  for (let i = 0; i < 14; i++) {
    let objmissileArea = missileArea.querySelector("img");
    objmissileArea = document.createElement("img");
    objmissileArea.setAttribute("class", "missileCount");
    missileArea.appendChild(objmissileArea);
  }
  const missileCount = document.querySelectorAll(".missileCount");

  // 안전한 곳에 id 추가
  let safeZonenum = Math.floor(Math.random() * 9 + 1);
  for (let j = 0; j < missileCount.length; j++) {
    missileCount[safeZonenum].setAttribute("id", "safeZone");
    missileCount[safeZonenum].removeAttribute("class", "missileCount");
  }
  // const safeZone = document.querySelector("#safeZone");
  let objmissileArea = missileArea.querySelectorAll(".missileCount");
  if (objmissileArea) {
    for (let i = 0; i < objmissileArea.length; i++) {
      objmissileArea[i].setAttribute("src", missileObj.src);
    }
  }
}
let missilePos = 0;
const missileSpeed = 2;

const score = document.querySelector("#score");
let scoreValue = 0;
score.innerText = `SCORE : ${scoreValue}`;

let requestId = null;

function movemissile() {
  missilePos += missileSpeed;
  missileArea.style.top = missilePos + "px";
  if (missilePos >= window.innerHeight) {
    //점수 내기
    scoreValue += 1;
    score.innerText = `SCORE : ${scoreValue}`;
    missilePos = 0;
    //미사일 재배치
    const removeMissileSelect = missileArea.querySelectorAll("img");
    for (let i = 0; i < removeMissileSelect.length; i++) {
      removeMissileSelect[i].setAttribute("class", "missileCount");
      removeMissileSelect[i].removeAttribute("src", " img/missile.png");
      removeMissileSelect[i].removeAttribute("id", "safeZone");
    }
    const removeMissileCount = document.querySelectorAll(".missileCount");
    let removeSafeZonenum = Math.floor(Math.random() * 9 + 1);
    for (let j = 0; j < removeMissileCount.length; j++) {
      removeMissileCount[removeSafeZonenum].setAttribute("id", "safeZone");
      removeMissileCount[removeSafeZonenum].removeAttribute(
        "class",
        "missileCount"
      );
    }
    let objmissileArea = missileArea.querySelectorAll(".missileCount");
    if (objmissileArea) {
      for (let i = 0; i < objmissileArea.length; i++) {
        objmissileArea[i].setAttribute("src", missileObj.src);
      }
    }
  }
  requestId = window.requestAnimationFrame(movemissile);
}
const playerScore = document.querySelector(".playerScore");
function bumpObj() {
  //가로가 맞았을 때
  const missileArea = document.querySelector(".missileArea");
  const missileTop = parseInt(missileArea.style.top);
  let missileAreaHeight = missileArea.offsetHeight;
  let airplaneTop = airplane.offsetTop;

  const safeZone = document.querySelector("#safeZone");
  let safeZoneLeft = safeZone.getBoundingClientRect().left;
  let safeZoneRight = safeZone.getBoundingClientRect().right;
  // console.log("이 사이에 위치해있어야함  " + safeZoneLeft, safeZoneRight);
  let airplaneLeft = airplane.getBoundingClientRect().left;
  let airplaneRight = airplane.getBoundingClientRect().right;
  // console.log(safeZoneLeft + "<" + airplaneLeft + "<" + safeZoneRight);
  if (
    missileTop + missileAreaHeight === airplaneTop + 10 &&
    (safeZoneLeft > airplaneLeft || safeZoneRight < airplaneRight)
  ) {
    gameArea.style.display = "none";
    endGame.style.display = "flex";
    window.cancelAnimationFrame(requestId);
    window.cancelAnimationFrame(stopImg);
    window.cancelAnimationFrame(stopImg1);
    playerScore.innerText = `획득 점수 : ${scoreValue} 점`;
  }
  setInterval(bumpObj, 100);
}
function restart() {
  window.location.reload();
}
