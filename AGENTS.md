# AGENTS.md

## NestJS

This app's version of NestJS is likely newer than what you know. https://docs.nestjs.com/llms.txt indexes its documentation, with a markdown page per chapter.


## URL shortener

Bitly like app to shorten urls 

## Functional requirments

- submit long URL and get a unique short one instead
- optionally support a custom alias instead-of random id
- optionally support an expiration time
- get redirect from the short URL to a long one

# Misc requirments

- short id length no more than 6 symols

## Entities 

- URL

## API

POST /urls {original, alias?, expireMs?} -> 200 {shortId}
GET /:shortId -> 302 to original or 404

