# Check different models on https://keras.io/api/applications/
import sys
import os
import cv2
os.environ['TF_CPP_MIN_LOG_LEVEL']='2'
from keras.preprocessing.image import load_img
from keras.preprocessing.image import img_to_array
from keras.applications.vgg16 import preprocess_input
from keras.applications.vgg16 import decode_predictions
from keras.applications.vgg16 import VGG16

# load the model
model = VGG16()
# model.summary()
# print(model.output_shape)

def predict(image):
	# resize image
	image = cv2.resize(image, (224, 224))
	# convert the image pixels to a numpy array
	image = img_to_array(image)
	# reshape data for the model
	image = image.reshape((1,224, 224,3))
	# prepare the image for the VGG model
	image = preprocess_input(image)
	# predict the probability across all output classes
	yhat = model.predict(image)
	# convert the probabilities to class labels
	label = decode_predictions(yhat, top=10)
	label = label[0][0]
	for item in range(0, 10):
		print(f"{label[0][item][1]}:{round(float(label[0][item][2])*100,2)}")


def init():
	imagePath = sys.argv[1]
	# print('Image path: ', imagePath)
	image = cv2.imread(imagePath)
	# cv2.imshow("VGG16 Predictor",image)
	predict(image)

if __name__=='__main__':
	init()