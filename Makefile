
.PHONY: build-sdk
build-sdk:
	(cd $$KRATOS_DIR; make sdk)
	cp $$KRATOS_DIR/spec/api.json ./contrib/sdk/api.json
	npx @openapitools/openapi-generator-cli generate -i "./contrib/sdk/api.json" \
		-g typescript-axios \
		-o "./contrib/sdk/generated" \
		--git-user-id ory \
		--git-repo-id sdk \
		--git-host github.com \
		-c ./contrib/sdk/typescript.yml
	(cd ./contrib/sdk/generated; npm i; npm run build)
	rm -rf node_modules/@ory/kratos-client/*
	cp -r ./contrib/sdk/generated/* node_modules/@ory/client

.PHONY: clean-sdk
clean-sdk:
	rm -rf node_modules/@ory/client/
	npm i