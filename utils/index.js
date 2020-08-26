exports.urlEncodeS3Key = function(text){
    return `https://s3.us-east-1.amazonaws.com/atlscribes.org-recordings/${encodeURIComponent(text)}`
}