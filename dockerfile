FROM nginx:alpine
RUN apk --update add bash nano
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /tmp/index.html
COPY ./start.sh /
RUN chmod +x /start.sh
CMD ["nginx", "-g", "daemon off;"]
#ENTRYPOINT [ "/start.sh" ]