FROM python:3-onbuild
COPY . .usr/src/app
WORKDIR .usr/src/app
RUN python manage.py drop_db
RUN python manage.py create_db
ENTRYPOINT ["python"]
CMD ["manage.py", "runserver", "--host=0.0.0.0"]

