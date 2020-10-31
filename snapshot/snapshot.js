const WIDTH = 1900;
const HEIGHT = 600;

let stepIndex = 0;
const processors = [{localState: "observer local state", snapshotToken: "randTokenP0", subsequentProcc: [1, 2], snapshotState:""},
  {localState: 'p1 state', snapshotToken: "", msgReceived: [], subsequentProcc: [4]},
  {localState: 'p2 state', snapshotToken: "", msgReceived: [], subsequentProcc: [3]},
  {localState: 'p3 state', snapshotToken: "", msgReceived: [], subsequentProcc: [2]},
  {localState: 'p4 state', snapshotToken: "", msgReceived: [], subsequentProcc: [2]}];

//save observer local state
processors[0].snapshotState += processors[0].localState + "\n";
//send snapshot token to subsequentProcc
processors[0].subsequentProcc.forEach((item, i) => {
  processors[item].msgReceived.push({snapshot: processors[0].snapshotToken});
});

function step() {
  for (let i = 1; i <= processors.length - 1; i++) {
    if ( processors[i].msgReceived ) {
      let lastMsg = processors[i].msgReceived[processors[i].msgReceived.length - 1];
      //process has already token and receives a message without token -> send received msg to observer snapshot state
      if ((processors[i].snapshotToken == processors[0].snapshotToken) && (lastMsg.snapshot !== processors[i].snapshotToken)) {
        processors[0].snapshotState += lastMsg.msg + "\n";
      }
      //process doent have the token -> adds it and sents local state to observer
      if ( lastMsg.snapshot && lastMsg.snapshot == processors[0].snapshotToken ) {
        processors[i].snapshotToken = lastMsg.snapshot;
        processors[0].snapshotState += processors[i].localState + "\n";
      }
    }
    //send msg to all subsequent procc
    let sendMsg = {};
    if (processors[i].snapshotToken) sendMsg.snapshot = processors[i].snapshotToken;
    sendMsg.msg = processors[i].localState;
    processors[i].subsequentProcc.forEach((item, i) => {
      processors[item].msgReceived.push(sendMsg);
    });
  }
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
}

function draw() {
  clear();
  textAlign(LEFT, BOTTOM)
  textSize(32)
  text('Snapshot Chandy-Larport', 10, HEIGHT / 12)
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
    text('localState:' + processor.localState, left + 20, top + 50);
    text('snapshotToken:' + processor.snapshotToken, left + 20, top + 65);
    text('subsequentProcc:' + processor.subsequentProcc, left + 20, top + 80);
    if (iIndex == 0) {
      text('snapshotState:' + processor.snapshotState, left - 200, top + 80);
    } else {
      text('msgReceived:\n', left + 20, top + 160);
      let indexKey = 0;
      processor.msgReceived.forEach((item, j) => {
        Object.keys(item).forEach(key => {
          text(key + ':' + item[key], left + 20, top + 180 + (50 * indexKey) + (10 * j));
          indexKey++;
        });
      });
    }
  });

  textAlign(LEFT, BOTTOM)
  textSize(18)
  text('Click to advance', WIDTH / 10, HEIGHT)
}

function mouseClicked() {
  step();
  stepIndex++;
}
