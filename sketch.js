let sound, amplitude, fft, randomX, randomY
//sets the amount of rectangles I want to make
let rectAmount = 50
let rectHeights = []
function preload() {
  // loads the song I want to use
  sound = loadSound("thegreatestsongever.mp3")
}

function setup() {
  // Makes the Canvas 3D
  createCanvas(windowWidth, windowHeight, WEBGL)
  // allows me to get the volume of the song at a single moment
  amplitude = new p5.Amplitude()
  colorMode(HSB, 100)
  // allows me to get the pitch of the song at a single moment
  fft = new p5.FFT(0.8, 256)
  rectMode(CENTER)
  // sets the random amount for the x and y to be translated for the toruses
  randomX = random(-width/4-50, -width/4+50)
  randomY = random(height/4-50, height/4+50)
}

function draw() {
  // gets the current volume of the song
  let level = amplitude.getLevel()
  // maps the background saturation from 0, 1 to 100, 0 so the quieter it is, the more colorful it is
  let bgSat = map(level, 0, 1, 100, 0)
  //sets the height for each individual rectangle
  for(let g = 0; g < rectAmount; g++) {
    rectHeights.push(g)
  }
  background(10, bgSat, 100)
  noStroke()
  let spectrum = fft.analyze()
  // determines how high the bars will be
  let nSamples = 0.85 * spectrum.length
  // this is for each individual bar
  for(let j = 0; j < rectAmount; j++) {
    // and this is for each rectangle in the bar
    for(let i = 0; i < nSamples ; i++) {
      // determines each rectangle's y value
      let y = map(i, 0, nSamples, height, 0)
      // determines each rectangle's height
      let h = map(spectrum[i], 0, 255*0.7, 0, width/2)
      // determines the rectangle's saturation
      let sat = map(spectrum[i], 0, 255*0.7, 0, 100)
      // fills with the color and appropriate saturation
      fill(10, sat, 100)
      push()
      // translates the rectangles specifically so they aren't shifted away because of WebGL mode
      translate(-width/2,-height/2)
      rect(width/rectAmount*j, y*rectHeights[j]*0.02, level*500, h*rectHeights[j]*0.01)
      pop()
    } 
  }
  if(bgSat < 85) {
    push()
    // this creates toruses if the sound is above a certain volume
    translate(randomX,randomY)
    for(let j = 0; j < 5; j++) {
      if(j % 2 === 0) {
        // this makes each torus have an alternating color
        fill('#F25C05')
        stroke('#F2955E')
      } else {
        fill('#F24607')
        stroke('#D9AB91')
      }
      // changes the stroke weight appropriately to match the volume and size
      strokeWeight(level*7)
      // rotates the toruses differently
      rotateY(j*frameCount*0.05)
      rotateX(j*frameCount*0.05)
      // draws the torus with variating height depending on the volume level
      torus(level*20*j*j,level*5*j*j)
    }
    pop()
  }
}

function mousePressed() {
  // this allows you to pause and play the song to your liking
  if(sound.isPlaying()) sound.pause()
  else sound.play()
}