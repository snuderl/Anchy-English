IMAGE := snuderl/anchy-english
TAG   := latest

.PHONY: build push

build:
	docker build -t $(IMAGE):$(TAG) .

push: build
	docker push $(IMAGE):$(TAG)
