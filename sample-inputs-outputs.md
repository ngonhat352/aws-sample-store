# PRODUCT (`/product`)

## 1. GET `/product `

- Return all products
- Input:
  ```json
  {}
  ```
- Output:

```json
{
  "message": "Successfully finished operation: \"GET\"",
  "body": [
    {
      "category": "Cars",
      "description": "It's a car that is named ABC",
      "id": "2143d9a7-cc0d-4570-a376-a1b9c66d860f",
      "price": 111.1,
      "name": "Car ABC",
      "imageFile": "product-1.png"
    },
    {}
  ]
}
```

## 2. GET `/product?category=${sth}` TODO

- Return all products of that category
- Input:

```
Query Strings: category=sth
```

- Output: same as 1

## 3. GET `/product/${id}`

- Return 1 specific product of id
- Input:

```
Path: id
```

- Output: same as 1

## 4. POST `/product`

- add new product to the database
- Input:

```json
{
  "name": "Car ABC",
  "description": "It's a car that is named ABC",
  "imageFile": "product-1.png",
  "category": "Cars",
  "price": 111.1
}
```

- Output:

```json
{
  "message": "Successfully finished operation: \"POST\"",
  "body": {
    "$metadata": {
      "httpStatusCode": 200,
      "requestId": "S5I56MRAABQB330CA508SUKDLFVV4KQNSO5AEMVJF66Q9ASUAAJG",
      "attempts": 1,
      "totalRetryDelay": 0
    }
  }
}
```

## 5. PUT `/product/${id}`

- Update any field in the product of that id
- Input:

```json
{
  "name": "Car DEF"
}
```

- Output: same as 4

## 6. DELETE `/product/${id}`

- Delete a product
- Input & Output: same as 3

---

# BASKET (`/basket`)

## 1. GET `/basket `

- Return all users' baskets
- Input:

  ```json
  {}
  ```

- Output:

```json
{
  "message": "Successfully finished operation: \"GET\"",
  "body": [
    {
      "userName": "ngonhat352",
      "items": [
        {
          "quantity": 2,
          "color": "Green",
          "price": 1000,
          "productId": "39b62367-87de-4d7f-88d9-896e9b22323d",
          "productName": "Car #14"
        },
        {
          "quantity": 1,
          "color": "Blue",
          "price": 500,
          "productId": "de5d8207-956d-4504-a5fc-d307a46dcfc9 ",
          "productName": "Vase #12"
        }
      ]
    }
  ]
}
```

## 2. POST `/basket `

- Update/save a user's basket
- Input:

```json
{
  "userName": "ngonhat352",
  "items": [
    {
      "quantity": 2,
      "color": "Green",
      "price": 1000,
      "productId": "39b62367-87de-4d7f-88d9-896e9b22323d",
      "productName": "Car #14"
    },
    {
      "quantity": 1,
      "color": "Blue",
      "price": 500,
      "productId": "de5d8207-956d-4504-a5fc-d307a46dcfc9 ",
      "productName": "Vase #12"
    }
  ]
}
```

- output:

```json
{
  "message": "Successfully finished operation: \"POST\"",
  "body": {
    "$metadata": {
      "httpStatusCode": 200,
      "requestId": "O4VAC0F1CQH1KANFUGEPE39IIJVV4KQNSO5AEMVJF66Q9ASUAAJG",
      "attempts": 1,
      "totalRetryDelay": 0
    }
  }
}
```

## 3. GET `/basket/${username} `

- Return a specific user's basket
- Input: { }
- Output: same as 1

## 4. DELETE `/basket/${username}`

- delete the whole basket of a user
- Input: { }
- Output: same as 2

## 5. POST `/basket/checkout`

- Check out basket -> sent straight to order lambda
- Input:

```json
{
  "userName": "ngonhat352",
  "totalPrice": 0,
  "firstName": "nathan",
  "lastName": "ngo",
  "email": "ngonhat352@gmail.com",
  "address": "minnesota",
  "cardInfo": "1234567890",
  "paymentMethod": 1
}
```

- Output:

```json
Successfully finished operation:
```

- Check Order DynamoDB table => new entry added

---

# ORDER (`/order`)

## 1. GET `/order/{user}?orderDate={timestamp}`

- Get orders of a user (can queried by date)
- Input:

```json
Path: user
Query Strings: orderDate=timestamp
```

- Output:

```json
{
  "message": "Successfully finished operation: \"GET\"",
  "body": [
    {
      "orderDate": "2023-04-28T08:45:59.942Z",
      "totalPrice": 1500,
      "lastName": "ngo",
      "userName": "ngonhat352",
      "paymentMethod": 1,
      "address": "minnesota",
      "email": "ngonhat352@gmail.com",
      "items": [
        {
          "quantity": 2,
          "color": "Green",
          "productId": "39b62367-87de-4d7f-88d9-896e9b22323d",
          "price": 1000,
          "productName": "Car #14"
        },
        {
          "quantity": 1,
          "color": "Blue",
          "productId": "de5d8207-956d-4504-a5fc-d307a46dcfc9 ",
          "price": 500,
          "productName": "Vase #12"
        }
      ],
      "firstName": "nathan",
      "cardInfo": "1234567890"
    }
  ]
}
```

## 2. GET `/order`

- Get all orders ever
