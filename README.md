# Handraising Detection AI

## *How to run on your local machine*

- Clone or download this repository.
- Open new terminal and cd frontend -> npm i -> npm run dev
- Open another terminal and cd backend -> npm i -> npm run dev

## *About this app*

This is a real-time hand raising detection web-app. It tracks the students raising hand and has alert sound if it detect any raising hand for at least two seconds.

## Functionality 

The following **required** functionality is completed:

* [*] Hand raising detection in real time.
* [*] History to look back and give participation score to those who raised hands during lectures.
* [*] Adding class feature.
* [*] Deleting app feature.

## Notes
- Some features are not fully implemented. There is a "History" feature that displays the images of the captured students who raised hands. Those images are not stored in our database. Instead, they are stored in the "public" folder.
- On the "Start Model" page, when you click "Stop Model" button, the model is still running. Please refresh the page to completely stop the model. Sorry, I will fix that bug if I got time.
- Our ML model is trained using the objects that is far from camera. Therefore, if you want to test our app, it is better to test with object that is at least 1 meter far from camera and at most 6 meter far from camera. You can test our app, using this video here [video]()
- This is our app demo video [video](https://youtu.be/UIZwZPt22dI?feature=shared)
- This is our ML model link https://universe.roboflow.com/project-qmmac/ksh-handraising-modelling/model/2


## License

    Copyright 2023 Kyaw Swar Hein, Supasek Dhanabordeephat, Kitibhum Supanurat, Warinthon Phiokhaw, Tom Luca Spradau, Lukas Theuerkauf
