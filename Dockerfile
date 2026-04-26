# On utilise un serveur web léger
FROM nginx:alpine

# On copie ton fichier HTML vers le dossier de Nginx
# Attention : vérifie que ton fichier s'appelle bien skycompare.html
COPY skycompare.html /usr/share/nginx/html/index.html

# On expose le port 80
EXPOSE 80

# On lance le serveur
CMD ["nginx", "-g", "daemon off;"]
