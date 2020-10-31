const WIDTH = 1900;
const HEIGHT = 600;

let stepIndex = 0;
const processors = [{beatLimit: 10, receivedBeats: {}, failedProcc: ""},
  {beatLimit: 2, receiverId: 0, sequenceId: 0},
  {beatLimit: 3, receiverId: 0, sequenceId: 0},
  {beatLimit: 4, receiverId: 0, sequenceId: 0}];

function step() {
  processors[0].receivedBeats[stepIndex] = [];

  for (let i = 1; i <= processors.length - 1; i++) {
    console.log(11, i);
    if (processors[i].sequenceId <= processors[i].beatLimit) {
      processors[i].sequenceId++;
      processors[0].receivedBeats[stepIndex].push({id: i, seq: processors[i].sequenceId});
    }
  }

  for (let i = 1; i <= processors.length - 1; i++) {
    let alive = false;
    processors[0].receivedBeats[stepIndex].forEach((beat, j) => {
      if (beat.id == i) alive = true;
    });

    if (!alive) processors[0].failedProcc += "id:" + i + '\n';
  }
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
}

function draw() {
  clear();
  textAlign(LEFT, BOTTOM)
  textSize(32)
  text('Central Heartbeat', 10, HEIGHT / 12)
  textAlign(LEFT, TOP)
  textSize(16)
  processors.forEach((processor, iIndex) => {
    const left = 250 + 100 * (iIndex + 1);
    const top = (HEIGHT / 2 - 150);

    fill(0);
    textAlign(CENTER, CENTER)
    textSize(16)
    text('P' + iIndex, left + 20, top + 20);
    textSize(13)
    text('limit:' + processor.beatLimit, left + 20, top + 50);
    if (iIndex == 0) {
      text('failedProcc:' + processor.failedProcc, left - 200, top + 80);
      text('receivedBeats:', left - 70, top + 50);
      let indexKey = 0;
      Object.keys(processor.receivedBeats).forEach(key => {
        processor.receivedBeats[key].forEach((item, j) => {
          text('id:' + item.id + " seq:" + item.seq, left - 70, top + 80 + (50 * indexKey) + (10 * j));
        });
        indexKey++;
      });
    } else {
      text('sequenceId:' + processor.sequenceId, left + 20, top + 60);
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
