# A Gender and Age Detection program by Mahesh Sawant

import cv2
import math
import argparse
import numpy
import base64
from tempfile import gettempdir

import os


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


parser = argparse.ArgumentParser()
parser.add_argument('--image')

args = parser.parse_args()

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

print(args.image)
video = cv2.VideoCapture(args.image if args.image else 0)

# img = base64.b64decode(args.image); 
# npimg = np.fromstring(img, dtype=np.uint8); 
# source = cv2.imdecode(npimg, 1)

padding = 20
while cv2.waitKey(1) < 0:
    hasFrame, frame = video.read()
    if not hasFrame:
        cv2.waitKey()
        break

    resultImg, faceBoxes = highlightFace(faceNet, frame)
    # if not faceBoxes:
    #     print("No face detected")

    for faceBox in faceBoxes:
        face = frame[max(0, faceBox[1]-padding):
                     min(faceBox[3]+padding, frame.shape[0]-1), max(0, faceBox[0]-padding):min(faceBox[2]+padding, frame.shape[1]-1)]

        blob = cv2.dnn.blobFromImage(
            face, 1.0, (227, 227), MODEL_MEAN_VALUES, swapRB=False)
        genderNet.setInput(blob)
        genderPreds = genderNet.forward()
        gender = genderList[genderPreds[0].argmax()]
        # print(f'Gender: {gender}')

        ageNet.setInput(blob)
        agePreds = ageNet.forward()
        age = ageList[agePreds[0].argmax()]
        # print(f'Age: {age[1:-1]} years')

        cv2.putText(resultImg, f'{gender}, {age}', (
            faceBox[0], faceBox[1]-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2, cv2.LINE_AA)
        # cv2.imshow("Detecting age and gender", resultImg)
        # print('hello prom py')

        cv2.imwrite( '_result.jpg', resultImg)
        # print("ggggggggggggggggggggggggg")
        # fourcc = cv2.VideoWriter_fourcc(*'XVID')
        # out = cv2.VideoWriter('output.avi',fourcc, 20.0, (300,300))
        # ret, frame = resultImg.read()
        # if ret==True:
        #  frame = cv2.flip(frame,0)
        #  out.write(frame)
        # # out.release()

        # cap = cv2.VideoCapture(0)
        # retval, image = cap.read()
        # cap.release()

        # Convert captured image to JPG
        # retval, buffer = cv2.imencode('.jpg', resultImg)

        # Convert to base64 encoding and show start of data
        # jpg_as_text = base64.b64encode(buffer)
        # print(jpg_as_text.decode("utf-8"))
    


        # # Convert back to binary
        # jpg_original = base64.b64decode(jpg_as_text)
        # # print(jpg_original)

        # # Write to a file to show conversion worked
        # with open('test.jpg', 'wb') as f_output:
        #     f_output.write(jpg_original)
