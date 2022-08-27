FROM nginx:alpine
RUN apk --update add bash nano
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]