FROM nginx:1.16-alpine

COPY --chown=nginx:nginx build/ /usr/share/nginx/html/

ENV app_base_url='https://app.prodf.verytecnologia.com.br'

RUN printf '\
server {\n\
    listen       80;\n\
    server_name localhost;\n\
\n\
    location / {\n\
        root   /usr/share/nginx/html;\n\
\n\
        try_files $uri $uri/ /index.html =404;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

RUN printf '\
sed -i "s|http://localhost:8080|$app_base_url|" /usr/share/nginx/html/main.*\n\
' > /start.sh && chmod +x /start.sh

EXPOSE 80

CMD /start.sh && nginx -g 'daemon off;'