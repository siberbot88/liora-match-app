# Liora Design System

> **UI Component Library & Theme Tokens for React Native**

Sistem design yang konsisten dan reusable untuk aplikasi Liora, berdasarkan spesifikasi Figma dengan TypeScript support.

---

## 📦 Installation

Semua komponen sudah tersedia di `src/components/ui` dan theme tokens di `src/theme`.

```typescript
// Import components
import { Button, Card, Input, Typography, Avatar, Badge } from '@/components/ui';

// Import theme tokens
import { colors, spacing, typography, shadows, radius } from '@/theme';
```

---

## 🎨 Theme Tokens

### Colors (from Figma)

```typescript
import { colors, brandColors } from '@/theme';

// Brand Colors
brandColors.mainColor       // #00ADB5 - Primary brand
brandColors.backgroundColor // #F5F5F5 - App background
brandColors.secondaryColor  // #222831 - Dark surfaces
brandColors.textColor       // #1B262C - Primary text
brandColors.buttonColor     // #FDD613 - Highlight/accent

// Semantic Colors
colors.primary       // Main brand color
colors.secondary     // Dark surfaces
colors.background    // App background
colors.surface       // White cards
colors.text          // Primary text
colors.accent        // Highlight buttons
colors.success       // Success states
colors.error         // Error states
colors.warning       // Warning states
```

### Typography

```typescript
import { typography } from '@/theme';

// Font Sizes
typography.fontSize.xs      // 12px
typography.fontSize.sm      // 14px
typography.fontSize.base    // 16px
typography.fontSize.lg      // 18px
typography.fontSize['2xl']  // 24px

// Text Style Presets
typography.textStyles.h1
typography.textStyles.body
typography.textStyles.button
```

### Spacing (4px grid)

```typescript
import { spacing } from '@/theme';

spacing.xs    // 4
spacing.sm    // 8
spacing.md    // 12
spacing.lg    // 16
spacing.xl    // 20
spacing['2xl'] // 24
```

### Shadows

```typescript
import { shadows } from '@/theme';

shadows.sm  // Subtle shadow
shadows.md  // Card shadow
shadows.lg  // Elevated shadow
```

---

## 🧩 Components

### Button

Reusable button dengan 5 variants dan 3 sizes.

```tsx
import { Button } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';

// Primary Button
<Button onPress={() => console.log('Pressed')}>
  Confirm Booking
</Button>

// Variants
<Button variant="primary" size="lg" fullWidth>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="accent">Accent</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// With Icons
<Button 
  variant="primary"
  leftIcon={<Ionicons name="checkmark" size={20} color="white" />}
>
  Save
</Button>

// Loading State
<Button loading>Processing...</Button>

// Disabled
<Button disabled>Disabled</Button>
```

**Props:**
- `variant`: `'primary' | 'secondary' | 'accent' | 'outline' | 'ghost'`
- `size`: `'sm' | 'md' | 'lg'`
- `loading`: boolean
- `disabled`: boolean
- `fullWidth`: boolean
- `leftIcon`, `rightIcon`: React.ReactNode

---

### Typography

Heading, Text, dan Label components.

```tsx
import { Heading, Text, Label } from '@/components/ui';

// Headings
<Heading level="h1">Title</Heading>
<Heading level="h2">Subtitle</Heading>
<Heading level="h3" color={colors.primary}>Section</Heading>

// Body Text
<Text variant="body">Regular text</Text>
<Text variant="bodyLarge" weight="semibold">Large text</Text>
<Text variant="bodySmall" color={colors.textSecondary}>Small text</Text>
<Text variant="caption">Caption text</Text>

// Labels (for forms)
<Label>Email Address</Label>
<Label required>Password</Label>
```

---

### Card

Container component untuk content grouping.

```tsx
import { Card } from '@/components/ui';

// Default Card
<Card>
  <Text>Card content</Text>
</Card>

// Variants
<Card variant="elevated" padding="lg">
  <Text>Elevated card with large padding</Text>
</Card>

<Card variant="outlined">
  <Text>Outlined card</Text>
</Card>

// Touchable Card
<Card onPress={() => console.log('Card pressed')}>
  <Text>Pressable card</Text>
</Card>
```

**Props:**
- `variant`: `'default' | 'outlined' | 'elevated'`
- `padding`: `'none' | 'sm' | 'md' | 'lg'`
- `onPress`: () => void (makes card touchable)

---

### Input

Text input dengan label, error states, dan icons.

```tsx
import { Input } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';

// Basic Input
<Input 
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
/>

// With Icons
<Input
  label="Search"
  leftIcon={<Ionicons name="search" size={20} />}
/>

// Error State
<Input
  label="Password"
  error="Password is required"
  secureTextEntry
/>

// Disabled
<Input label="Username" disabled value="john_doe" />
```

**Props:**
- `label`: string
- `error`: string
- `leftIcon`, `rightIcon`: React.ReactNode
- `disabled`: boolean
- Inherits all TextInput props

---

### Avatar

User avatar dengan image atau fallback.

```tsx
import { Avatar } from '@/components/ui';

// With Name (shows initials)
<Avatar name="John Doe" size="md" />

// With Image
<Avatar source={{ uri: 'https://...' }} size="lg" />

// Icon Fallback
<Avatar size="sm" />

// Sizes
<Avatar size="sm" />  // 32x32
<Avatar size="md" />  // 48x48
<Avatar size="lg" />  // 64x64
<Avatar size="xl" />  // 96x96
```

---

### Badge

Status badge/tag component.

```tsx
import { Badge } from '@/components/ui';

// Variants
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Rejected</Badge>
<Badge variant="info">New</Badge>
<Badge variant="primary">Featured</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
```

---

## 🎯 Best Practices

### 1. Always Use Theme Tokens

❌ **Bad:**
```typescript
style={{ backgroundColor: '#00ADB5', padding: 16 }}
```

✅ **Good:**
```typescript
import { colors, spacing } from '@/theme';
style={{ backgroundColor: colors.primary, padding: spacing.lg }}
```

### 2. Use Components Instead of Inline Styles

❌ **Bad:**
```tsx
<TouchableOpacity style={{ backgroundColor: '#00ADB5', padding: 16 }}>
  <Text style={{ color: 'white', fontWeight: '600' }}>Submit</Text>
</TouchableOpacity>
```

✅ **Good:**
```tsx
<Button variant="primary" onPress={handleSubmit}>Submit</Button>
```

### 3. Consistent Spacing

Gunakan spacing scale untuk padding/margin yang konsisten:
```typescript
// Good spacing values: xs(4), sm(8), md(12), lg(16), xl(20), 2xl(24)
paddingVertical: spacing.md,
gap: spacing.lg,
```

### 4. TypeScript Autocomplete

Manfaatkan TypeScript untuk autocomplete:
```typescript
import { ButtonVariant, TextVariant, ColorKey } from '@/components/ui';
```

---

## 🔄 Migration Guide

### From Inline Styles to Design System

**Before:**
```tsx
<TouchableOpacity style={{
  backgroundColor: '#007AFF',
  padding: 16,
  borderRadius: 10,
}}>
  <Text style={{ color: 'white', fontWeight: '600' }}>
    Book Now
  </Text>
</TouchableOpacity>
```

**After:**
```tsx
<Button variant="primary">Book Now</Button>
```

**Before:**
```tsx
<View style={{
  backgroundColor: '#FFFFFF',
  padding: 16,
  borderRadius: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
}}>
  <Text>Content</Text>
</View>
```

**After:**
```tsx
<Card variant="elevated" padding="md">
  <Text>Content</Text>
</Card>
```

---

## 📚 Examples

Lihat `src/screens/DesignSystemDemo.tsx` untuk contoh lengkap penggunaan semua components.

---

## 🎨 Color Reference

| Color Token | Hex | Usage |
|------------|-----|-------|
| `colors.primary` | #00ADB5 | Primary actions, links, accents |
| `colors.secondary` | #222831 | Dark surfaces, headers |
| `colors.background` | #F5F5F5 | App background |
| `colors.accent` | #FDD613 | Highlight buttons, badges |
| `colors.text` | #1B262C | Primary text |
| `colors.success` | #10B981 | Success states |
| `colors.error` | #EF4444 | Error states |
| `colors.warning` | #F59E0B | Warning states |

---

**Built with ❤️ for Liora**
