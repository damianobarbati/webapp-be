import awsSdk from 'aws-sdk';
import path from 'path';
import axios from 'axios';

const { config, S3, Endpoint } = awsSdk;

export const s3 = new S3({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_KEY_SECRET,
    endpoint: process.env.S3_ENDPOINT ? new Endpoint(process.env.S3_ENDPOINT) : undefined,
    signatureVersion: process.env.S3_SIGNATURE_VERSION,
    storageClass: process.env.S3_STORAGE_CLASS,
    region: process.env.S3_REGION,
    params: { Bucket: process.env.S3_BUCKET }
});

config.logger = console;

// currently not needed
export const renameWithDate = value => {
    const extension = path.extname(value);
    const filename = path.basename(value, extension);

    const result = `${filename}-${new Date().toISOString().split('.')[0]}${extension}`;
    return result;
};

export const getKeyFromUrl = url => new URL(url).pathname.slice(1);

export const getUploadURL = async ({ key, isPublic = false, metadata }) => {
    if (metadata)
        for (const key in metadata)
            metadata[key] = String(metadata[key]);

    const url = await s3.getSignedUrl('putObject', {
        Expires: Number(process.env.S3_URL_TTL),
        Key: key,
        CacheControl: 'max-age=31536000',
        ACL: isPublic ? 'public-read' : undefined,
        Metadata: metadata,
    });

    return url;
};
/* test without metadata
UPLOAD_URL=`curl -k -s 'https://localhost/api/media/getUploadURL' -d 'isPublic=1' -d 'key=test.txt' | jq -r .`
curl -X PUT "$UPLOAD_URL" -H 'x-amz-acl: public-read' -H 'Content-type: text/plain' --upload-file ./snippets/test.txt
open `curl -k 'https://localhost/api/media/getDownloadURL' -d 'key=test.txt' | jq -r .`
open "https://damianobarbati-com.fra1.digitaloceanspaces.com/test.txt"
*/

/* test with metadata
UPLOAD_URL=`curl -k -s 'https://localhost/api/media/getUploadURL' -H 'Content-type: application/json' -d '{"isPublic":1,"key":"test.mp4","metadata":{"duration":6}}' | jq -r .`
curl -X PUT "$UPLOAD_URL" -H 'x-amz-acl: public-read' -H 'x-amz-meta-duration: 6' -H 'Content-type: video/mp4' --upload-file ./snippets/test.mp4
open `curl -k 'https://localhost/api/media/getDownloadURL' -d 'key=test.mp4' | jq -r .`
open "https://damianobarbati-com.fra1.digitaloceanspaces.com/test.mp4"
*/

// UPLOAD_URL=`curl -k 'https://localhost/api/media/getUploadURL' -d 'isPublic=1' -d 'key=test.mp4'`
// curl -X PUT $UPLOAD_URL --upload-file ./assets/test.mp4
// open https://irca-media.s3.eu-central-1.amazonaws.com/test.mp4

export const getDownloadURL = async ({ key }) => {
    // if key is URL then convert to key
    try {
        key = getKeyFromUrl(key);
    }
    catch (error) {} // eslint-disable-line

    const url = await s3.getSignedUrl('getObject', {
        Expires: Number(process.env.S3_URL_TTL),
        Key: key,
    });

    return url;
};
// curl -k 'https://localhost/api/media/getDownloadURL' -d 'key=test.txt'
// open `curl -k 'https://localhost/api/media/getDownloadURL' -d 'key=test.txt'`

// curl -k 'https://localhost/api/media/getDownloadURL' -d 'key=test.mp4'
// open `curl -k 'https://localhost/api/media/getDownloadURL' -d 'key=test.mp4'`

export const getMetadata = async ({ url }) => {
    if (process.env.S3_ENDPOINT.includes('digitaloceanspaces.com')) {
        const { headers } = await axios.head(url);
        const result = {};
        for (const [key, value] of Object.entries(headers))
            if (key.startsWith('x-amz-meta-'))
                result[key.replace('x-amz-meta-', '')] = value;
        return result;
    }
    else {
        const { Metadata } = await s3.headObject({
            Key: getKeyFromUrl(url),
        }).promise();

        return Metadata;
    }
};
// curl -k 'https://localhost/api/media/getMetadata' -d 'url=https://damianobarbati-com.fra1.digitaloceanspaces.com/test.mp4'
