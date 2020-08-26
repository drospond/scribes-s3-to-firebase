
/**
 * 
 * @param text firebase object key
 */
exports.urlEncodeS3Key = function(text){
    return `https://s3.us-east-1.amazonaws.com/atlscribes.org-recordings/${encodeURIComponent(text)}`
}

exports.constructEntryObject = function(textFile, wavFile){
    const getParams = {
        Bucket: "atlscribes.org-recordings",
        Key: textFile.Key,
    };
    s3.getObject(getParams, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            entryObject ={
                wavURl: utils.urlEncodeS3Key(wavFile.Key),
                wavETag: wavFile.ETag,
                text: data.Body.toString()
            }
            return entryObject;
        }
    });
}