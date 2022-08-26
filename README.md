# simple-file-server

This is a simple file server ready for docker (and the smalles possible -27.7MB image-). Just tell the folder to share and it will offer in the simplest way possible.

This is mainly to provide some features quick. Is not meant for any serious deployment.

```bash

# Go to the file server folder and make the image
docker build -t simple-file-server-container . --no-cache

# To start the service isolated just run (in root folder) 
docker run --rm -v <path-to-your-folder>:/var/www/static -it -p 8080:80 simple-file-server-container
```

# Masterplan

* Basic feature (done)
* Json format files listing to consume (to emulate a rest api to serve a file system)
