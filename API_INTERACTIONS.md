# API Documentation - User Interactions

Tài liệu này mô tả các API liên quan đến việc quản lý interaction_history của user (view, like, cart, purchase, review).

## Base URL
```
/api/v1
```

---

## 1. Tạo Interaction Mới (Tự động cập nhật interaction_history)

### Endpoint
```
POST /api/v1/user-interactions
```

### Mô tả
Tạo một interaction mới trong collection `user_interactions` và tự động cập nhật `interaction_history` của user trong MongoDB.

**Lưu ý:** Nếu đã có interaction với `product_id` đó trong `interaction_history`, hệ thống sẽ **cập nhật** thay vì thêm mới.

### Request Body
```json
{
  "user_id": "691cd83e5fee2d4ca1ba6a46",
  "product_id": "10793",
  "interaction_type": "view",
  "rating": 5  // optional, chỉ dùng cho review
}
```

### Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_id` | string | Yes | ID của user (ObjectId) |
| `product_id` | string/int | Yes | ID của product |
| `interaction_type` | string | Yes | Loại interaction: `view`, `like`, `cart`, `purchase`, `review` |
| `rating` | integer | No | Đánh giá (1-5), chỉ dùng khi `interaction_type` = `review` |

### Response Success (201 Created)
```json
{
  "success": true,
  "message": "User interaction created successfully",
  "data": {
    "interaction": {
      "id": "67890abcdef1234567890",
      "product_id": "10793",
      "interaction_type": "view",
      "rating": null,
      "timestamp": "2025-11-29T19:44:17.071000"
    }
  }
}
```

### Response Error (400 Bad Request)
```json
{
  "success": false,
  "message": "user_id is required when not logged in.",
  "data": null
}
```

### Ví dụ sử dụng

#### React Hook (Khuyến nghị)
```typescript
import { useCreateUserInteraction } from '@/hooks/api/useUserInteraction';

function ProductView({ productId }: { productId: string }) {
  const createInteraction = useCreateUserInteraction();

  const handleViewProduct = async () => {
    try {
      await createInteraction.mutateAsync({
        product_id: productId,
        interaction_type: 'view',
        // user_id is optional if user is logged in (extracted from token)
      });
      console.log('Interaction created successfully');
    } catch (error) {
      console.error('Error creating interaction:', error);
    }
  };

  return (
    <div onClick={handleViewProduct}>
      {createInteraction.isPending ? 'Loading...' : 'View Product'}
    </div>
  );
}
```

#### JavaScript/TypeScript (Fetch API)
```javascript
const createInteraction = async (userId, productId, interactionType) => {
  const response = await fetch('/api/v1/user-interactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      product_id: productId,
      interaction_type: interactionType
    })
  });
  
  const data = await response.json();
  return data;
};

// Sử dụng
await createInteraction('691cd83e5fee2d4ca1ba6a46', '10793', 'view');
```

#### Axios
```javascript
import axios from 'axios';

const createInteraction = async (userId, productId, interactionType) => {
  try {
    const response = await axios.post('/api/v1/user-interactions', {
      user_id: userId,
      product_id: productId,
      interaction_type: interactionType
    });
    return response.data;
  } catch (error) {
    console.error('Error creating interaction:', error.response?.data);
    throw error;
  }
};
```

---

## 2. Thêm Interaction vào interaction_history

### Endpoint
```
POST /api/v1/users/{user_id}/add_interaction
```

### Mô tả
Thêm một interaction trực tiếp vào `interaction_history` của user mà không tạo record trong collection `user_interactions`.

**Lưu ý:** Nếu đã có interaction với `product_id` đó, sẽ **thêm mới** (không cập nhật).

### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | string | Yes | ID của user (ObjectId) |

### Request Body
```json
{
  "product_id": 10793,
  "interaction_type": "view",
  "timestamp": "2025-11-29T19:44:17.071000"  // optional
}
```

### Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_id` | integer/string | Yes | ID của product |
| `interaction_type` | string | Yes | Loại interaction: `view`, `like`, `cart`, `purchase`, `review` |
| `timestamp` | string | No | ISO format datetime string. Nếu không có, mặc định là thời gian hiện tại |

### Response Success (201 Created)
```json
{
  "success": true,
  "message": "Interaction added to user history successfully",
  "data": {
    "user_id": "691cd83e5fee2d4ca1ba6a46",
    "interaction": {
      "product_id": 10793,
      "interaction_type": "view",
      "timestamp": "2025-11-29T19:44:17.071000"
    },
    "total_interactions": 10
  }
}
```

### Response Error (400 Bad Request)
```json
{
  "success": false,
  "message": "product_id is required.",
  "data": null
}
```

### Response Error (404 Not Found)
```json
{
  "success": false,
  "message": "User does not exist.",
  "data": null
}
```

### Ví dụ sử dụng

#### React Hook (Khuyến nghị)
```typescript
import { useAddInteractionToHistory } from '@/hooks/api/useUserInteraction';

function ProductCard({ productId, userId }: { productId: string; userId: string }) {
  const addInteraction = useAddInteractionToHistory(userId);

  const handleAddToHistory = async () => {
    try {
      await addInteraction.mutateAsync({
        product_id: productId,
        interaction_type: 'view',
        // timestamp is optional, defaults to current time
      });
      console.log('Interaction added to history');
    } catch (error) {
      console.error('Error adding interaction:', error);
    }
  };

  return (
    <button onClick={handleAddToHistory} disabled={addInteraction.isPending}>
      {addInteraction.isPending ? 'Adding...' : 'Add to History'}
    </button>
  );
}
```

#### JavaScript/TypeScript (Fetch API)
```javascript
const addInteraction = async (userId, productId, interactionType, timestamp = null) => {
  const body = {
    product_id: productId,
    interaction_type: interactionType
  };
  
  if (timestamp) {
    body.timestamp = timestamp;
  }
  
  const response = await fetch(`/api/v1/users/${userId}/add_interaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });
  
  const data = await response.json();
  return data;
};

// Sử dụng
await addInteraction('691cd83e5fee2d4ca1ba6a46', 10793, 'view');
```

---

## 3. Cập nhật Interaction Type (Quan trọng nhất)

### Endpoint
```
PUT /api/v1/users/{user_id}/update_interaction
PATCH /api/v1/users/{user_id}/update_interaction
```

### Mô tả
Cập nhật `interaction_type` cho một product cụ thể trong `interaction_history` của user. 

**Đây là API chính để cập nhật interaction_type** (ví dụ: từ "view" → "purchase").

**Lưu ý:** 
- Nếu đã có interaction với `product_id` đó, sẽ **cập nhật** interaction_type và timestamp
- Nếu chưa có, sẽ **tạo mới** interaction

### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | string | Yes | ID của user (ObjectId) |

### Request Body
```json
{
  "product_id": 10793,
  "interaction_type": "purchase",
  "timestamp": "2025-11-29T20:00:00"  // optional
}
```

### Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_id` | integer/string | Yes | ID của product |
| `interaction_type` | string | Yes | Loại interaction mới: `view`, `like`, `cart`, `purchase`, `review` |
| `timestamp` | string | No | ISO format datetime string. Nếu không có, mặc định là thời gian hiện tại |

### Response Success (200 OK)
```json
{
  "success": true,
  "message": "Interaction updated successfully",
  "data": {
    "user_id": "691cd83e5fee2d4ca1ba6a46",
    "product_id": 10793,
    "interaction_type": "purchase",
    "updated": true,  // true nếu đã cập nhật, false nếu tạo mới
    "total_interactions": 10
  }
}
```

### Response Error (400 Bad Request)
```json
{
  "success": false,
  "message": "interaction_type must be one of: view, like, cart, purchase, review",
  "data": null
}
```

### Response Error (404 Not Found)
```json
{
  "success": false,
  "message": "User does not exist.",
  "data": null
}
```

### Ví dụ sử dụng

#### React Hook (Khuyến nghị)
```typescript
import { useUpdateInteraction } from '@/hooks/api/useUserInteraction';

function ProductActions({ productId, userId }: { productId: string; userId: string }) {
  const updateInteraction = useUpdateInteraction(userId);

  const handleView = async () => {
    await updateInteraction.mutateAsync({
      product_id: productId,
      interaction_type: 'view',
    });
  };

  const handleAddToCart = async () => {
    await updateInteraction.mutateAsync({
      product_id: productId,
      interaction_type: 'cart',
    });
  };

  const handlePurchase = async () => {
    await updateInteraction.mutateAsync({
      product_id: productId,
      interaction_type: 'purchase',
    });
  };

  return (
    <div>
      <button onClick={handleView}>View</button>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <button onClick={handlePurchase}>Purchase</button>
      {updateInteraction.isPending && <span>Updating...</span>}
    </div>
  );
}

// Ví dụ: User xem product → sau đó mua
// Component sẽ tự động cập nhật từ 'view' → 'purchase'
```

#### JavaScript/TypeScript (Fetch API)
```javascript
const updateInteraction = async (userId, productId, interactionType, timestamp = null) => {
  const body = {
    product_id: productId,
    interaction_type: interactionType
  };
  
  if (timestamp) {
    body.timestamp = timestamp;
  }
  
  const response = await fetch(`/api/v1/users/${userId}/update_interaction`, {
    method: 'PUT',  // hoặc 'PATCH'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });
  
  const data = await response.json();
  return data;
};

// Ví dụ: User xem product → sau đó mua
await updateInteraction('691cd83e5fee2d4ca1ba6a46', 10793, 'view');
// ... sau đó user mua
await updateInteraction('691cd83e5fee2d4ca1ba6a46', 10793, 'purchase');
```

#### Axios
```javascript
import axios from 'axios';

const updateInteraction = async (userId, productId, interactionType) => {
  try {
    const response = await axios.put(`/api/v1/users/${userId}/update_interaction`, {
      product_id: productId,
      interaction_type: interactionType
    });
    return response.data;
  } catch (error) {
    console.error('Error updating interaction:', error.response?.data);
    throw error;
  }
};
```

---

## 4. Lấy danh sách Interactions

### Endpoint
```
GET /api/v1/user-interactions
```

### Mô tả
Lấy danh sách tất cả interactions từ collection `user_interactions`.

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | Số trang (mặc định: 1) |
| `page_size` | integer | No | Số items mỗi trang (mặc định: 20) |

### Response Success (200 OK)
```json
{
  "success": true,
  "message": "User interactions retrieved successfully",
  "data": {
    "interactions": [
      {
        "id": "67890abcdef1234567890",
        "product_id": "10793",
        "interaction_type": "view",
        "rating": null,
        "timestamp": "2025-11-29T19:44:17.071000"
      }
    ],
    "page": 1,
    "pages": 5,
    "perPage": 20,
    "count": 100
  }
}
```

### Ví dụ sử dụng

#### React Hook (Khuyến nghị)
```typescript
import { useGetUserInteractions } from '@/hooks/api/useUserInteraction';

function InteractionsList() {
  const { data, isLoading, error } = useGetUserInteractions({
    page: 1,
    page_size: 20,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>User Interactions ({data?.data?.count || 0})</h2>
      {data?.data?.interactions.map((interaction) => (
        <div key={interaction.id}>
          <p>Product: {interaction.product_id}</p>
          <p>Type: {interaction.interaction_type}</p>
          <p>Time: {new Date(interaction.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 5. Lấy thông tin User (bao gồm interaction_history)

### Endpoint
```
GET /api/v1/users/{user_id}
```

### Mô tả
Lấy thông tin chi tiết của user, bao gồm `interaction_history`.

### Response Success (200 OK)
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": "691cd83e5fee2d4ca1ba6a46",
      "email": "user@example.com",
      "name": "User Name",
      "interaction_history": [
        {
          "product_id": 10793,
          "interaction_type": "purchase",
          "timestamp": "2025-11-29T19:44:17.071000"
        }
      ]
    }
  }
}
```

### Ví dụ sử dụng

#### React Hook
```typescript
import { useGetUserById } from '@/hooks/api/useUser';

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading } = useGetUserById(userId);

  if (isLoading) return <div>Loading...</div>;

  const interactionHistory = data?.data?.user?.interaction_history || [];

  return (
    <div>
      <h2>User: {data?.data?.user?.name}</h2>
      <h3>Interaction History ({interactionHistory.length})</h3>
      {interactionHistory.map((interaction, index) => (
        <div key={index}>
          <p>Product: {interaction.product_id}</p>
          <p>Type: {interaction.interaction_type}</p>
          <p>Time: {new Date(interaction.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Interaction Types

Các loại interaction được hỗ trợ:

| Type | Mô tả | Thứ tự ưu tiên |
|------|-------|----------------|
| `view` | User xem sản phẩm | 1 (thấp nhất) |
| `like` | User thích sản phẩm | 2 |
| `cart` | User thêm vào giỏ hàng | 3 |
| `purchase` | User mua sản phẩm | 4 (cao nhất) |
| `review` | User đánh giá sản phẩm | - |

**Lưu ý:** Khi cập nhật interaction_type, interaction cũ sẽ được thay thế hoàn toàn (không giữ lịch sử).

---

## React Hooks Summary

Tất cả các hooks đã được tạo trong `src/hooks/api/useUserInteraction.ts`:

| Hook | Mô tả | Parameters |
|------|-------|------------|
| `useGetUserInteractions` | Lấy danh sách interactions | `query?: { page?, page_size? }` |
| `useCreateUserInteraction` | Tạo interaction mới | Mutation hook |
| `useAddInteractionToHistory` | Thêm vào interaction_history | `userId: string` |
| `useUpdateInteraction` | Cập nhật interaction type | `userId: string` |

### Import Hooks
```typescript
import {
  useGetUserInteractions,
  useCreateUserInteraction,
  useAddInteractionToHistory,
  useUpdateInteraction,
} from '@/hooks/api/useUserInteraction';
```

---

## Use Cases

### Use Case 1: User xem sản phẩm → Mua sản phẩm

#### Với React Hook
```typescript
import { useUpdateInteraction } from '@/hooks/api/useUserInteraction';

function ProductPage({ productId, userId }: { productId: string; userId: string }) {
  const updateInteraction = useUpdateInteraction(userId);

  useEffect(() => {
    // Bước 1: User xem sản phẩm
    updateInteraction.mutate({
      product_id: productId,
      interaction_type: 'view',
    });
  }, [productId]);

  const handlePurchase = () => {
    // Bước 2: User mua sản phẩm (tự động cập nhật từ 'view' → 'purchase')
    updateInteraction.mutate({
      product_id: productId,
      interaction_type: 'purchase',
    });
  };

  return <button onClick={handlePurchase}>Buy Now</button>;
}
```

#### Với JavaScript/TypeScript
```javascript
// Bước 1: User xem sản phẩm
await updateInteraction(userId, productId, 'view');

// Bước 2: User mua sản phẩm (tự động cập nhật từ 'view' → 'purchase')
await updateInteraction(userId, productId, 'purchase');
```

### Use Case 2: User thêm vào giỏ hàng → Mua

#### Với React Hook
```typescript
import { useUpdateInteraction } from '@/hooks/api/useUserInteraction';

function AddToCartButton({ productId, userId }: { productId: string; userId: string }) {
  const updateInteraction = useUpdateInteraction(userId);

  const handleAddToCart = () => {
    // Bước 1: User thêm vào giỏ hàng
    updateInteraction.mutate({
      product_id: productId,
      interaction_type: 'cart',
    });
  };

  const handlePurchase = () => {
    // Bước 2: User mua
    updateInteraction.mutate({
      product_id: productId,
      interaction_type: 'purchase',
    });
  };

  return (
    <>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <button onClick={handlePurchase}>Buy Now</button>
    </>
  );
}
```

#### Với JavaScript/TypeScript
```javascript
// Bước 1: User thêm vào giỏ hàng
await updateInteraction(userId, productId, 'cart');

// Bước 2: User mua
await updateInteraction(userId, productId, 'purchase');
```

### Use Case 3: Tạo interaction và tự động cập nhật history

#### Với React Hook
```typescript
import { useCreateUserInteraction, useUpdateInteraction } from '@/hooks/api/useUserInteraction';

function ProductView({ productId, userId }: { productId: string; userId?: string }) {
  const createInteraction = useCreateUserInteraction();
  const updateInteraction = useUpdateInteraction(userId!);

  useEffect(() => {
    // Tạo interaction mới (tự động cập nhật interaction_history)
    createInteraction.mutate({
      product_id: productId,
      interaction_type: 'view',
      user_id: userId, // Optional if logged in
    });
  }, [productId]);

  const handlePurchase = () => {
    // Nếu user mua sau đó, cập nhật lại
    updateInteraction.mutate({
      product_id: productId,
      interaction_type: 'purchase',
    });
  };

  return <button onClick={handlePurchase}>Purchase</button>;
}
```

#### Với JavaScript/TypeScript
```javascript
// Tạo interaction mới (tự động cập nhật interaction_history)
await createInteraction(userId, productId, 'view');

// Nếu user mua sau đó, cập nhật lại
await updateInteraction(userId, productId, 'purchase');
```

---

## Error Handling

Tất cả các API đều trả về format chuẩn:

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

### HTTP Status Codes
- `200 OK` - Thành công (GET, PUT, PATCH)
- `201 Created` - Tạo mới thành công (POST)
- `400 Bad Request` - Dữ liệu không hợp lệ
- `404 Not Found` - Không tìm thấy resource
- `500 Internal Server Error` - Lỗi server

---

## React Hooks Documentation

### Tổng quan

Tất cả các hooks đã được tạo trong `src/hooks/api/useUserInteraction.ts` và sử dụng React Query để quản lý state và cache.

### 1. useGetUserInteractions

Hook để lấy danh sách tất cả user interactions.

```typescript
import { useGetUserInteractions } from '@/hooks/api/useUserInteraction';

const { data, isLoading, error, refetch } = useGetUserInteractions({
  page: 1,
  page_size: 20,
});
```

**Parameters:**
- `query?: { page?: number, page_size?: number }` - Query parameters (optional)

**Returns:**
- `data` - Response data từ API
- `isLoading` - Trạng thái loading
- `error` - Error object nếu có lỗi
- `refetch` - Function để refetch data

### 2. useCreateUserInteraction

Hook để tạo interaction mới. Tự động cập nhật interaction_history.

```typescript
import { useCreateUserInteraction } from '@/hooks/api/useUserInteraction';

const createInteraction = useCreateUserInteraction();

// Sử dụng
createInteraction.mutate({
  product_id: '10793',
  interaction_type: 'view',
  user_id: '691cd83e5fee2d4ca1ba6a46', // Optional if logged in
  rating: 5, // Optional, only for review type
});
```

**Returns:**
- `mutate` - Function để gọi API
- `mutateAsync` - Async version của mutate
- `isPending` - Trạng thái đang xử lý
- `isSuccess` - Trạng thái thành công
- `isError` - Trạng thái lỗi
- `error` - Error object nếu có lỗi
- `data` - Response data sau khi thành công

### 3. useAddInteractionToHistory

Hook để thêm interaction trực tiếp vào interaction_history.

```typescript
import { useAddInteractionToHistory } from '@/hooks/api/useUserInteraction';

const addInteraction = useAddInteractionToHistory(userId);

// Sử dụng
addInteraction.mutate({
  product_id: 10793,
  interaction_type: 'view',
  timestamp: '2025-11-29T19:44:17.071000', // Optional
});
```

**Parameters:**
- `userId: string` - ID của user

**Returns:**
- Tương tự như `useCreateUserInteraction`

### 4. useUpdateInteraction

Hook chính để cập nhật interaction type. Đây là hook quan trọng nhất.

```typescript
import { useUpdateInteraction } from '@/hooks/api/useUserInteraction';

const updateInteraction = useUpdateInteraction(userId);

// Sử dụng
updateInteraction.mutate({
  product_id: 10793,
  interaction_type: 'purchase',
  timestamp: '2025-11-29T20:00:00', // Optional
});
```

**Parameters:**
- `userId: string` - ID của user

**Returns:**
- Tương tự như `useCreateUserInteraction`

### Ví dụ sử dụng đầy đủ

```typescript
import {
  useGetUserInteractions,
  useCreateUserInteraction,
  useUpdateInteraction,
} from '@/hooks/api/useUserInteraction';
import { useGetUserById } from '@/hooks/api/useUser';

function ProductInteractionTracker({ productId, userId }: { productId: string; userId: string }) {
  // Get user info including interaction_history
  const { data: userData } = useGetUserById(userId);
  
  // Get all interactions
  const { data: interactionsData } = useGetUserInteractions({ page: 1, page_size: 10 });
  
  // Create interaction
  const createInteraction = useCreateUserInteraction();
  
  // Update interaction
  const updateInteraction = useUpdateInteraction(userId);

  const handleView = () => {
    updateInteraction.mutate({
      product_id: productId,
      interaction_type: 'view',
    });
  };

  const handleLike = () => {
    updateInteraction.mutate({
      product_id: productId,
      interaction_type: 'like',
    });
  };

  const handleAddToCart = () => {
    updateInteraction.mutate({
      product_id: productId,
      interaction_type: 'cart',
    });
  };

  const handlePurchase = () => {
    updateInteraction.mutate({
      product_id: productId,
      interaction_type: 'purchase',
    });
  };

  const handleReview = (rating: number) => {
    createInteraction.mutate({
      product_id: productId,
      interaction_type: 'review',
      rating,
    });
  };

  // Get current interaction type for this product
  const currentInteraction = userData?.data?.user?.interaction_history?.find(
    (ih) => ih.product_id === productId
  );

  return (
    <div>
      <h2>Product Interactions</h2>
      <p>Current interaction: {currentInteraction?.interaction_type || 'none'}</p>
      
      <div>
        <button onClick={handleView}>View</button>
        <button onClick={handleLike}>Like</button>
        <button onClick={handleAddToCart}>Add to Cart</button>
        <button onClick={handlePurchase}>Purchase</button>
        <button onClick={() => handleReview(5)}>Review (5 stars)</button>
      </div>

      <div>
        <h3>All Interactions ({interactionsData?.data?.count || 0})</h3>
        {interactionsData?.data?.interactions.map((interaction) => (
          <div key={interaction.id}>
            Product: {interaction.product_id} - Type: {interaction.interaction_type}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Lưu ý khi sử dụng hooks

1. **Cache Invalidation**: Tất cả hooks đã tự động invalidate cache khi cần thiết
2. **Error Handling**: Luôn kiểm tra `isError` và `error` để xử lý lỗi
3. **Loading States**: Sử dụng `isLoading` hoặc `isPending` để hiển thị loading indicator
4. **Optimistic Updates**: Có thể implement optimistic updates nếu cần
5. **User ID**: Đảm bảo `userId` được truyền đúng, có thể lấy từ auth context/state

---

## UI Components

Đã tạo 2 components demo để test và sử dụng các hooks:

### 1. ProductInteractionTracker

Component để track và quản lý product interactions trên product page.

**Location:** `src/components/Product/ProductInteractionTracker.tsx`

**Props:**
- `productId: string | number` - ID của product
- `onInteractionChange?: (interactionType: string) => void` - Callback khi interaction thay đổi

**Features:**
- Tự động track "view" khi component mount
- Buttons để thực hiện các interaction: Like, Add to Cart, Purchase, Review
- Hiển thị current interaction type
- Hiển thị loading states và error messages
- Hiển thị tổng số interactions

**Sử dụng:**
```typescript
import ProductInteractionTracker from '@/components/Product/ProductInteractionTracker';

function ProductPage({ productId }: { productId: string }) {
  return (
    <div>
      <ProductInfo productId={productId} />
      <ProductInteractionTracker 
        productId={productId}
        onInteractionChange={(type) => console.log('Interaction:', type)}
        showStats={false} // Tùy chọn: hiển thị thống kê
        compact={false} // Tùy chọn: chế độ compact
      />
    </div>
  );
}
```

### 2. InteractionHistoryView

Component để hiển thị lịch sử interaction của user.

**Location:** `src/components/User/InteractionHistoryView.tsx`

**Features:**
- Hiển thị interaction_history từ user profile
- Hiển thị tất cả interactions từ user_interactions collection
- Pagination cho danh sách interactions
- Table format với color-coded interaction types
- Loading states

**Sử dụng:**
```typescript
import InteractionHistoryView from '@/components/User/InteractionHistoryView';

function UserProfilePage() {
  return (
    <div>
      <h1>User Profile</h1>
      <InteractionHistoryView />
    </div>
  );
}
```

### Tích hợp vào Product Page

Để tích hợp vào product page hiện tại, thêm component vào `ProductInfo.jsx`:

```javascript
import ProductInteractionTracker from './ProductInteractionTracker';

// Trong ProductInfo component, thêm:
<ProductInteractionTracker 
  productId={productId}
  compact={true} // Chế độ compact để không chiếm nhiều không gian
/>
```

### Tích hợp vào User Profile

Để tích hợp vào user profile, thêm vào profile content:

```javascript
import InteractionHistoryView from '../User/InteractionHistoryView';

// Trong ProfileContent hoặc SettingsContent:
<InteractionHistoryView />
```

---

## Tích hợp đầy đủ vào các Screen

Đã tích hợp hooks vào tất cả các screen và components để tự động track interactions:

### 1. VIEW Interaction
**Location:** `src/screens/user/ProductScreen.jsx`

Tự động track khi user xem product detail page:
```javascript
// Tự động track VIEW khi product được load
useEffect(() => {
  if (product?._id && currentUserId) {
    updateInteraction.mutate({
      product_id: product._id,
      interaction_type: 'view',
    });
  }
}, [product?._id, currentUserId]);
```

### 2. LIKE Interaction
**Location:** `src/screens/user/ProductScreen.jsx`

Track khi user add/remove favorite:
```javascript
const handleAddToFavorites = async () => {
  // ... add favorite logic
  // Track LIKE interaction
  if (currentUserId) {
    updateInteraction.mutate({
      product_id: product._id,
      interaction_type: 'like',
    });
  }
};
```

### 3. CART Interaction
**Location:** `src/screens/user/ProductScreen.jsx` (addToCartHandler)

Track khi user add to cart:
```javascript
const addToCartHandler = ({ qty, size, color }) => {
  // ... add to cart logic
  // Track CART interaction
  if (currentUserId && product?._id) {
    updateInteraction.mutate({
      product_id: product._id,
      interaction_type: 'cart',
    });
  }
};
```

### 4. PURCHASE Interaction
**Location:** `src/screens/user/PlaceOrderScreen.jsx`

Track khi order được tạo thành công:
```javascript
useEffect(() => {
  if (success && order?._id) {
    // Track PURCHASE interaction for all products in the order
    if (userId && selectedItems.length > 0) {
      selectedItems.forEach((item) => {
        if (item.product) {
          updateInteraction.mutate({
            product_id: item.product,
            interaction_type: 'purchase',
          });
        }
      });
    }
    // ... redirect to order page
  }
}, [success, order?._id, userId]);
```

### 5. REVIEW Interaction
**Location:** `src/components/Product/ProductReview.jsx`

Track khi user submit review:
```javascript
const handleSubmitReview = async (e) => {
  // ... create review logic
  // Track REVIEW interaction
  if (userId && productId) {
    createInteraction.mutate({
      product_id: productId,
      interaction_type: 'review',
      rating: rating || 5,
      user_id: userId,
    });
  }
};
```

---

## Flow hoàn chỉnh

### Flow 1: User xem → Like → Add to Cart → Purchase → Review

1. **VIEW**: User vào ProductScreen → Tự động track `view`
2. **LIKE**: User click "Add to Favorites" → Track `like`
3. **CART**: User click "Add to Cart" → Track `cart` (cập nhật từ `view`/`like`)
4. **PURCHASE**: User checkout và order thành công → Track `purchase` (cập nhật từ `cart`)
5. **REVIEW**: User submit review → Track `review`

### Flow 2: User xem → Purchase trực tiếp

1. **VIEW**: User vào ProductScreen → Tự động track `view`
2. **PURCHASE**: User checkout ngay → Track `purchase` (cập nhật từ `view`)

### Flow 3: User xem → Add to Cart → Remove → Purchase sau

1. **VIEW**: User vào ProductScreen → Tự động track `view`
2. **CART**: User add to cart → Track `cart`
3. **PURCHASE**: User checkout sau đó → Track `purchase` (cập nhật từ `cart`)

---

## Kiểm tra và Test

Tất cả các interactions đã được tích hợp vào:
- ✅ ProductScreen - VIEW, LIKE, CART
- ✅ PlaceOrderScreen - PURCHASE
- ✅ ProductReview - REVIEW
- ✅ ProductInteractionTracker - Component track interactions đầy đủ
- ✅ InteractionHistoryView - Hiển thị lịch sử

### Cách test:

1. **Test VIEW**: Vào bất kỳ product page nào → Kiểm tra interaction_history có `view`
2. **Test LIKE**: Click favorite button → Kiểm tra interaction_history có `like`
3. **Test CART**: Add to cart → Kiểm tra interaction_history có `cart`
4. **Test PURCHASE**: Complete order → Kiểm tra interaction_history có `purchase` cho tất cả products
5. **Test REVIEW**: Submit review → Kiểm tra interaction_history có `review` với rating

### Xem lịch sử:

Sử dụng component `InteractionHistoryView` hoặc check user profile API để xem `interaction_history`.


