# API Architecture

Created: Sep 8, 2020 6:39 AM
Created By: M Sayer


# /users

## /users/register

### POST

creates and authenticates new user

**DATA PARAMS**:

 `{`

`"first_name": "firstname",`

`"last_name": "lastname",`

`"username": "username123",`

`"password": "password123",`

`"email": "email@email.com",`

`}` 

**SUCCESS RESPONSE**

code: 200 

content: 

`{ authToken : 'JWTString' }` 

**ERROR RESPONSE**

**When missing fields in request body**

code: 400

content:  

`{ error: Missing {value missing} in request body }`

**When username is already taken**

code: 401

content: 

`{ error: username unavailable }`

W**hen email is already registered**

code: 401

content: 

`{ error: email already in use }`

**When password does not fit requirements**

code: 401

content: 

`{ error: Password must contain one upper case, lower case, number and special character }`

**When password starts or ends with an empty space**

code: 401

content: 

`{ error: Password must not start or end with empty spaces }`

**When password is too long**

code: 401

content: 

`{ error: Password must be less than 20 characters }`

**When password is too short**

code: 401

content: 

`{ error: Password must be longer than 8 characters }`

## /users/login

### POST

authenticates returning user

**DATA PARAMS:**

 `{`

`"username": "username123",`

`"password": "password123",`

`}` 

**SUCCESS RESPONSE**

code: 200

content: 

`{ authToken: jwtTokenHere }` 

**ERROR RESPONSE**

code: 401

content: 

`{ error: missing credentials }`

code: 401

content: 

`{ error: invalid credentials }`

## /users/:id

returns user object

**URL Params:**

Required: id=[integer]

### GET

**Data Params:** None

**SUCCESS RESPONSE**

code: 200

content: 

`{` 

`"username": "username123",`

`"balance": 1000,`

`"allowance": 500,` 

`}`

**ERROR RESPONSE**

code: 401

content:

`{ error: "missing credentials" }`

OR

code: 401

content:

`{ error: "invalid credentials" }`

# /transactions

## /transactions

### GET

returns all transactions for user

**Data Params:** user_id from request body

**SUCCESS RESPONSE**

Code: 200

content: 

`{`

`income: [income]`

`expenses: [expenses]`

`}`

**ERROR RESPONSE**

## /transactions/:type

**URL Params:** 

Required: 

type=[string] , 1 of [income, expenses]

### POST

creates new income or expenses transaction

**Data Params:**

`{`

`"user_id": 1,`

`"name": "example name",`

`"description": "example description" // this field optional`

`"${type}_amount": 1243,`

`"${type}_category": "example category",`

`}`

**SUCCESS RESPONSE**

code: 204

**ERROR RESPONSE**

## /transactions/:type/:id

**URL Params:** 

Required: 

type=[string], 1 of [income, expenses]

id=[integer]

### GET

returns specified transaction from income or expenses

**Data Params:** None

**SUCCESS RESPONSE**

code: 200

content: 

`{`

`"user_id": 1,`

`"name": "example name",`

`"description": "example description" // this field optional`

`"${type}_amount": 1243,`

`"${type}_category": "example category",`

`"date_created": "2020-09-12",`

`}`

**ERROR RESPONSE**

### PATCH

Updates specified income or expenses transaction

**Data Params:**

`{`

`"user_id": 1,`

`"name": "updated name",`

`"description": "updated description" // this field optional`

`"${type}_amount": 1243,`

`"${type}_category": "updated category",`

`"date_created": "2020-09-12",`

`}`

**SUCCESS RESPONSE**

code: 204

**ERROR RESPONSE**

### **DELETE**

Deletes specified income or expenses transaction

**Data Params: N**one

**SUCCESS RESPONSE**

code: 204

**ERROR RESPONSE**

# /goals

## /goals

### GET

returns all goals for user

**Data Params:** user_id from request body

**SUCCESS RESPONSE**

Code: 200

content: 

`{`

`goals: [goals]`

`}`

**ERROR RESPONSE**

### POST

creates new goal

**Data Params:** 

`{`

`"user_id": 1,`

`"goal_amount": 150,`

`"contribution_amount": 25,`

`"current_amount": 0,`

`"end_date": "2020-12-29",`

`}`

**SUCCESS RESPONSE**

code: 204

**ERROR RESPONSE**

## /goals/:id

**URL Params:**

Required: id=[integer]

### GET

returns specified goal for user

**Data Params**: None

**SUCCESS RESPONSE**

code: 200

content:

`{`

`"user_id": 1,`

`"goal_amount": 150,`

`"contribution_amount": 25,`

`"current_amount": 0,`

`"end_date": "2020-12-29",`

`"completed": false,`

`"date_created": "2020-09-12",`

`}`

**ERROR RESPONSE**

### PATCH

Updated specified goal

**Data Params**:

`{`

`"user_id": 1,`

`"goal_amount": 200,`

`"contribution_amount": 50,`

`"current_amount": 50,`

`"end_date": "2020-12-29",`

`"completed": false,`

`"date_created": "2020-09-12",`

`}`

**SUCCESS RESPONSE**

code: 204

**ERROR RESPONSE**

### DELETE

Deletes specified goal

**Data Params:** None

**SUCCESS RESPONSE**

code: 204

**ERROR RESPONSE**