Providing a simple folder structures as json objects. 

> This is only for testing and mocking purposes, do not try to use it in productive environments.


# Using in dev environmnet

```bash
# It's needed a env variable 
export FAKE_REST_TARGET_DIR=<the path to list files>

# After that run 
npm run api_serve
```

# Using docker 

> There's no need to setup eny env variable. But its needed to mount a volume to provide the folder path to describe in the service

```bash
#Building 
docker build . -t fake-rest-files --no-cache

#Running
docker run --rm -it -p 6543:3456 -v <a path>:/data fake-rest-files 

```