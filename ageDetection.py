# A Gender and Age Detection program by Mahesh Sawant

import cv2
import math
import argparse
import numpy
import base64
import mimetypes
import json

from tempfile import gettempdir

import os

def detectOnVideo(frame):

    dirr = args.image + '_result.mp4v'
    vid_writer = cv2.VideoWriter(dirr.format(str(args.image).split(".")[0]),cv2.VideoWriter_fourcc(*'XVID'), 15, (frame.shape[1],frame.shape[0]))

    padding = 20
    while cv2.waitKey(1) < 0:
        hasFrame, frame = video.read()
        if not hasFrame:
            cv2.waitKey()
            break

        if args.method == "deep":
            resultImg, faceBoxes = highlightFace(faceNet, frame)
        else:
            resultImg, faceBoxes = detectFaceOpenCVHaar(faceCascade, frame)


        if not faceBoxes:
            print("No face detected")

        for faceBox in faceBoxes:
            face = frame[max(0, faceBox[1]-padding):
                        min(faceBox[3]+padding, frame.shape[0]-1), max(0, faceBox[0]-padding):min(faceBox[2]+padding, frame.shape[1]-1)]

            blob = cv2.dnn.blobFromImage(
                face, 1.0, (227, 227), MODEL_MEAN_VALUES, swapRB=False)

            ageNet.setInput(blob)
            agePreds = ageNet.forward()
            age = ageList[agePreds[0].argmax()]
            # print(f'Age: {age[1:-1]} years')

            cv2.putText(resultImg, f'Age: {age}', (
                faceBox[0], faceBox[1]+250), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 102, 255), 2, cv2.LINE_AA)
            # cv2.imshow("Detecting age and gender", resultImg)

        vid_writer.write(resultImg)

    print(json.dumps({"DOM": "video",'type': 'mp4v'}))
    cv2.destroyAllWindows()
    vid_writer.release()
 
def detectOnImage(frame):

    detectedAgeList = []
    padding = 20
    
    if args.method == "deep":
        resultImg, faceBoxes = highlightFace(faceNet, frame)
    else:
        resultImg, faceBoxes = detectFaceOpenCVHaar(faceCascade, frame)

    if not faceBoxes:
        print("No face detected")

    for faceBox in faceBoxes:
        face = frame[max(0, faceBox[1]-padding):
                    min(faceBox[3]+padding, frame.shape[0]-1), max(0, faceBox[0]-padding):min(faceBox[2]+padding, frame.shape[1]-1)]
        
        blob = cv2.dnn.blobFromImage(
            face, 1.0, (227, 227), MODEL_MEAN_VALUES, swapRB=False)

        ageNet.setInput(blob)
        agePreds = ageNet.forward()
        age = ageList[agePreds[0].argmax()]
        # print(f'Age: {age[1:-1]} years')
        detectedAgeList.append(age)

        cv2.putText(resultImg, f'Age: {age}', (
            faceBox[0], faceBox[1]-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2, cv2.LINE_AA)

        cv2.imwrite( os.path.join(gettempdir(),'uploads',args.image +'_result.jpg'), resultImg)
    print(json.dumps({"DOM": "img",'type': 'jpg', "ageList": detectedAgeList}))
    cv2.destroyAllWindows()
 
def highlightFace(net, frame, conf_threshold=0.7):
    frameOpencvDnn = frame.copy()
    frameHeight = frameOpencvDnn.shape[0]
    frameWidth = frameOpencvDnn.shape[1]
    blob = cv2.dnn.blobFromImage(frameOpencvDnn, 1.0, (300, 300), [
                                 104, 117, 123], True, False)

    net.setInput(blob)
    detections = net.forward()
    faceBoxes = []
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > conf_threshold:
            x1 = int(detections[0, 0, i, 3]*frameWidth)
            y1 = int(detections[0, 0, i, 4]*frameHeight)
            x2 = int(detections[0, 0, i, 5]*frameWidth)
            y2 = int(detections[0, 0, i, 6]*frameHeight)
            faceBoxes.append([x1, y1, x2, y2])
            cv2.rectangle(frameOpencvDnn, (x1, y1), (x2, y2),
                          (0, 255, 0), int(round(frameHeight/150)), 8)
    return frameOpencvDnn, faceBoxes

def detectFaceOpenCVHaar(faceCascade, frame, inHeight=300, inWidth=0):

    frameOpenCVHaar = frame.copy()
    frameHeight = frameOpenCVHaar.shape[0]
    frameWidth = frameOpenCVHaar.shape[1]
    if not inWidth:
        inWidth = int((frameWidth / frameHeight) * inHeight)

    scaleHeight = frameHeight / inHeight
    scaleWidth = frameWidth / inWidth

    frameOpenCVHaarSmall = cv2.resize(frameOpenCVHaar, (inWidth, inHeight))
    frameGray = cv2.cvtColor(frameOpenCVHaarSmall, cv2.COLOR_BGR2GRAY)

    faces = faceCascade.detectMultiScale(frameGray)
    bboxes = []
    for (x, y, w, h) in faces:
        x1 = x
        y1 = y
        x2 = x + w
        y2 = y + h
        cvRect = [int(x1 * scaleWidth), int(y1 * scaleHeight),
                  int(x2 * scaleWidth), int(y2 * scaleHeight)]
        bboxes.append(cvRect)
        cv2.rectangle(frameOpenCVHaar, (cvRect[0], cvRect[1]), (cvRect[2], cvRect[3]), (0, 255, 0),
                      int(round(frameHeight / 150)), 4)
    return frameOpenCVHaar, bboxes



parser = argparse.ArgumentParser()
parser.add_argument('--image')
parser.add_argument('--socket_id')
parser.add_argument('--method')



args = parser.parse_args()

faceCascade = cv2.CascadeClassifier('opencv_models/haarcascade_frontalface_default.xml')
faceProto = "opencv_models/opencv_face_detector.pbtxt"
faceModel = "opencv_models/opencv_face_detector_uint8.pb"
ageProto = "opencv_models/age_deploy.prototxt"
ageModel = "opencv_models/age_net.caffemodel"
genderProto = "opencv_models/gender_deploy.prototxt"
genderModel = "opencv_models/gender_net.caffemodel"

MODEL_MEAN_VALUES = (78.4263377603, 87.7689143744, 114.895847746)
ageList = ['(0-2)', '(4-6)', '(8-12)', '(15-20)',
           '(25-32)', '(38-43)', '(48-53)', '(60-100)']
genderList = ['Male', 'Female']


faceNet = cv2.dnn.readNet(faceModel, faceProto)
ageNet = cv2.dnn.readNet(ageModel, ageProto)
genderNet = cv2.dnn.readNet(genderModel, genderProto)

video = cv2.VideoCapture(args.image if args.image else 0)
hasFrame, frame = video.read()

     
# check file type 
mimetypes.init()

mimestart = mimetypes.guess_type(args.image)[0]

if mimestart != None:
    mimestart = mimestart.split('/')[0]

    # if mimestart != 'video' or mimestart != 'image':
        # print("only video or image file type enabled")
    if mimestart == 'video':
        detectOnVideo(frame)
    else: 
        detectOnImage(frame)

