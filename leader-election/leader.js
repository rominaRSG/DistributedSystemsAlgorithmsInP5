const WIDTH = 1900;
const HEIGHT = 600;

let stepIndex = 0;
let leaderAttr = 28;
const processors = [
  {electionAttr: 3, msgReceived: [], electionResult: 28, state: "ok1"},
  {electionAttr: 24, msgReceived: [], electionResult: 28, state: "ok2"},
  {electionAttr: 1, msgReceived: [], electionResult: 28, state: "ok3"},
  {electionAttr: 28, msgReceived: [], electionResult: 28, state: "ok4"},
  {electionAttr: 15, msgReceived: [], electionResult: 28, state: "ok5"}
];

//failed leader
processors[3].state = 'failed';

function step() {
  for (let i = 0; i <= processors.length - 1; i++) {
    //send messages clockwise
    let nextProcc = i == processors.length - 1 ? 0 : i+1

    processors[nextProcc].msgReceived.push({state: processors[i].state});

    if (processors[i].msgReceived.length !== 0) {
      let lastMsg = processors[i].msgReceived[processors[i].msgReceived.length - 1];
      let prevProcc = i > 0 ? i-1 : processors.length - 1;

      //if received failed and is leader initiate election
      if (lastMsg.state == 'failed' && processors[prevProcc].electionAttr == leaderAttr) {
        processors[nextProcc].msgReceived.push({election: processors[i].electionAttr});
      }

      //if received election compare attr and forward the greates
      if (lastMsg.election) {
        if (processors[i].state == 'failed') {
          processors[nextProcc].msgReceived.push({election: lastMsg.election});
        } else {
          if (lastMsg.election < processors[i].electionAttr) {
            processors[nextProcc].msgReceived.push({election: processors[i].electionAttr});
          } else if (lastMsg.election == processors[i].electionAttr) {
            processors[nextProcc].msgReceived.push({electionResult: lastMsg.election});
            processors[i].electionResult = lastMsg.election;
            leaderAttr = lastMsg.election;
          } else {
            processors[nextProcc].msgReceived.push({election: lastMsg.election});
          }
        }
      }

      //if election ended send result to others
      if (lastMsg.electionResult) {
        processors[i].electionResult = lastMsg.electionResult;
        processors[nextProcc].msgReceived.push({electionResult: lastMsg.electionResult});
      }
    }
  }
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
}

function draw() {
  clear();
  textAlign(LEFT, BOTTOM)
  textSize(32)
  text('Ring Leader Election', 10, HEIGHT / 12)
  textSize(22)
  text('LeaderAttr:' + leaderAttr, 10, HEIGHT + 20 / 12)
  textAlign(LEFT, TOP)
  textSize(16)
  processors.forEach((processor, iIndex) => {
    const left = 350 + 200 * (iIndex + 1);
    const top = (HEIGHT / 2 - 150);

    fill(0);
    textAlign(CENTER, CENTER)
    textSize(16)
    text('P' + iIndex, left + 20, top + 20);
    textSize(13)
    text('electionAttr:' + processor.electionAttr, left + 20, top + 50);
    text('electionResult:' + processor.electionResult, left + 20, top + 65);
    text('state:' + processor.state, left + 20, top + 80);
    text('msgReceived:\n', left + 20, top + 160);
    let indexKey = 0;
    processor.msgReceived.forEach((item, j) => {
      Object.keys(item).forEach(key => {
        text(key + ':' + item[key], left + 20, top + 180 + (15 * indexKey) + (10 * j));
        indexKey++;
      });
    });
  });

  textAlign(LEFT, BOTTOM)
  textSize(18)
  text('Click to advance', WIDTH / 10, HEIGHT)
}

function mouseClicked() {
  step();
  stepIndex++;
}
