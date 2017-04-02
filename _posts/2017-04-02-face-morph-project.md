---
layout: post
title: Face Morphing Project
description: This project aims to demonstrate various face morphing technics using dlib and OpenCV
category: articles
tags: 
---
# About
I have created a [face morphing project](https://github.com/zjxhz/facemorph) on github to demonstrate various face morphing technics using [dlib](dlib.net) and [OpenCV](opencv.org). Most of the ideas and code were originally from [LearnOpenCV](http://learnopencv.com). 

# Prerequisite
This is a C++ project, and CMake was used to build it. 

Firslty, you need to install following tools and libs:

* CMake
* dlib
* OpenCV
* Boost(to create a folder...)

In MacOS, you may use `brew` to install them.

```bash
brew install cmake
brew tap homebrew/science
brew install dlib
brew install opencv3
brew install boost
```

A few notes:
* `bew tap` is to add a new repository where these seientific libaries can be found
* you must install `opencv3`, rather than `opencv` as `seamlessClone` is only availabe from opencv3. 
* you may need to install some dependent libaries.

# Build
## clone the source

`git clone https://github.com/zjxhz/facemorph`

## Build
```bash
cd facemorph
mkdir build
cmake ..
make
```

# Run
## Face Landmarks
One of the very first thing of face morphing is to detect, and extract faces from images. The faces can be saved as the input for further processing. Ideally, the saved faces need to have fixed size, and are placed more or less in the middle. dlib can do all of these with a few lines of code.

### Prepare face images
Place the images to a folder, e.g. `/path/to/images/`. The cropped faces will be of size 200x200, so make sure original images are of proper size.

### Trained model
In order to generate landmarks, you need to have trained model for face recognition, you may train the model youself; or you may download one from [here](http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2):

`wget http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2`

### Generate
`./face_landmarks_ex shape_predictor_68_face_landmarks.dat.bz2 /path/to/images/*.jpg`

After this, cropped faces and landmarks will be generated under `/path/to/images/cropped/`. Also, an average data is genereated. Please note, you may need to change file suffix accordingly if your files are not jpg format.

## Face Average
`./face_avereage_ex /path/to/images/cropped/*.jpg`

This will generate and display the averaged face. The averaged face will be seamlessly cloned to the face of the first person. To change this, check function `faceSwap`. Also, currently, the averaged face is of size 200x200.

# Open Issues
* Generating face landmarks seem a bit too slow. This may be that dlib was not built using the AVX option.


