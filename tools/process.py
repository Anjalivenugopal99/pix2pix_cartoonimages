import os
import cv2
from numpy import genfromtxt
import tensorflow as tf
import os, os.path
import numpy as np
from matplotlib import pyplot as plt


# the dataset contains csv and png files for each image. Extract the png files only to a file loaction.
def extractImageFiles():
    path = './newData/cartoonSet10k'
    for images in os.listdir(path):
        print(images)
        if ".csv" in images:
            print(images)
        else:
            path1 = os.path.join(path,images)
            img = cv2.imread(path1)
            img = cv2.resize(img, (256,256))
            cv2.imwrite(path1, img)

# The following function process all images in a folder, detect edges and save them as new images

def processImages():
    imageDir = "./newData/cartoonSet10k/" #specify your path here
    image_path_list = []
    #specify your vald extensions here. Cartoon dataset contains only png files
    valid_image_extensions = [".jpg", ".jpeg", ".png", ".tif", ".tiff"] 
    valid_image_extensions = [item.lower() for item in valid_image_extensions]

    for file in os.listdir(imageDir):
        extension = os.path.splitext(file)[1]
        if extension.lower() not in valid_image_extensions:
            continue
        image_path_list.append(os.path.join(imageDir, file))

    for imagePath in image_path_list:
    # read the img
        img = cv2.imread(imagePath,0)
        if img is None:
            continue

    # detect edges
        edges = cv2.Canny(img,256,256)
    # revert white and balck
        newEdges = cv2.bitwise_not(edges)
    # save output image in the edges foler
        path = imagePath.replace("cartoonSet10k", "modified")
        cv2.imwrite(path,newEdges)
        
# combine both the images to a new location

def combine(src, src_path):
    edge_dir = './newData/modified'
    # find corresponding file in b_dir, could have a different extension
    basename, _ = os.path.splitext(os.path.basename(src_path))
    for ext in [".png", ".jpg"]:
        sibling_path = os.path.join(edge_dir, basename + ext)
        if os.path.exists(sibling_path):
            sibling = tf.keras.preprocessing.image.load_img(sibling_path)
            break
    else:
        raise Exception("could not find sibling image for " + src_path)

    # make sure that dimensions are correct
    height, width, _ = src.shape
    if height != sibling.shape[0] or width != sibling.shape[1]:
        raise Exception("differing sizes")
    
    # convert both images to RGB if necessary
    if src.shape[2] == 1:
        src = im.grayscale_to_rgb(images=src)

    if sibling.shape[2] == 1:
        sibling = im.grayscale_to_rgb(images=sibling)

    # remove alpha channel
    if src.shape[2] == 4:
        src = src[:,:,:3]
    
    if sibling.shape[2] == 4:
        sibling = sibling[:,:,:3]

    return np.concatenate([src, sibling], axis=1)
