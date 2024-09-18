let sound, amplitude, fft
let rectHeights = []
function preload() {
  sound = loadSound("thegreatestsongever.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL)
  amplitude = new p5.Amplitude()
  colorMode(HSB, 100)
  fft = new p5.FFT(0.8, 256)
  rectMode(CENTER)
}

function draw() {
  let level = amplitude.getLevel()
  let bgSat = map(level, 0, 1, 100, 0)
  let rectAmount = 50
  for(let g = 0; g < rectAmount; g++) {
    rectHeights.push(g)
  }
  background(10, bgSat, 100)
  noStroke()
  let spectrum = fft.analyze()
  let nSamples = 0.85 * spectrum.length
  for(let j = 0; j < rectAmount; j++) {
    for(let i = 0; i < nSamples ; i++) {
      let y = map(i, 0, nSamples, height, 0)
      let h = map(spectrum[i], 0, 255*0.7, 0, width/2)
      let sat = map(spectrum[i], 0, 255*0.7, 0, 100)
      fill(10, sat, 100)
      push()
      translate(-width/2,-height/2)
      rect(width/rectAmount*j, y*rectHeights[j]*0.02, level*500, h*rectHeights[j]*0.01)
      pop()
    } 
  }
  if(bgSat < 85) {
    push()
    translate(-width/4,height/4)
    for(let j = 0; j < 5; j++) {
      if(j % 2 === 0) {
        fill('#F25C05')
        stroke('#F2955E')
      } else {
        fill('#F24607')
        stroke('#D9AB91')
      }
      strokeWeight(level*7)
      rotateY(j*frameCount*0.05)
      rotateX(j*frameCount*0.05)
      torus(level*20*j*j,level*5*j*j)
    }
    pop()
  }
}

function mousePressed() {
  if(sound.isPlaying()) sound.pause()
  else sound.play()
}