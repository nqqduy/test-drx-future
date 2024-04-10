SHELL := /bin/bash

deploy:
	rsync -avhzL --delete \
		--no-perms --no-owner --no-group \
		--exclude .git \
		--filter=":- .gitignore" \
		. ubuntu@18.140.163.133:DRX-future
