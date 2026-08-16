// src/Pages/Products/index.jsx

import React, { useState, useEffect } from 'react';

import {
  Box,
  Typography,
  Alert,
  Skeleton,
  Pagination,
  Container,
  useTheme,
  Snackbar,
} from '@mui/material';

import ProductCard from './ProductCard';

// ======================================================
// تبدیل Product API به اطلاعات مورد نیاز ProductCard
// ======================================================

const processProductToCard = (product) => {
  if (!product) return null;

  console.log('========================================');
  console.log('🔄 پردازش محصول:', product._id);
  console.log('📦 Product کامل:', product);
  console.log('🏷️ brandId اصلی Product:', product.brandId);
  console.log(
    '📦 واریانت‌های محصول:',
    product.productVariantIds
  );
  console.log('========================================');

  let defaultVariant = null;
  let defaultVariantId = null;
  let inStock = false;

  // ======================================================
  // پیدا کردن Default Variant
  // ======================================================

  if (
    product.productVariantIds &&
    Array.isArray(product.productVariantIds) &&
    product.productVariantIds.length > 0
  ) {
    console.log(
      '✅ محصول دارای واریانت است',
      product.productVariantIds.length
    );

    // ----------------------------------------------------
    // اگر defaultProductVariantId وجود داشته باشد
    // ----------------------------------------------------

    if (product.defaultProductVariantId) {
      console.log(
        '🎯 defaultProductVariantId:',
        product.defaultProductVariantId
      );

      defaultVariant =
        product.defaultProductVariantId;

      // اگر آبجکت باشد
      if (
        typeof defaultVariant === 'object'
      ) {
        defaultVariantId =
          defaultVariant._id ||
          defaultVariant.id ||
          null;
      }

      // اگر String باشد
      else {
        defaultVariantId =
          defaultVariant;
      }

      console.log(
        '🎯 defaultVariantId:',
        defaultVariantId
      );
    }

    // ----------------------------------------------------
    // اگر Default Variant وجود نداشت
    // اولین Variant
    // ----------------------------------------------------

    else {
      console.log(
        '🔄 defaultProductVariantId وجود ندارد'
      );

      defaultVariant =
        product.productVariantIds[0];

      if (
        typeof defaultVariant === 'object'
      ) {
        defaultVariantId =
          defaultVariant._id ||
          defaultVariant.id ||
          null;
      } else {
        defaultVariantId =
          defaultVariant;
      }

      console.log(
        '🔄 اولین Variant ID:',
        defaultVariantId
      );
    }

    // ====================================================
    // بررسی موجودی
    // ====================================================

    if (
      defaultVariant &&
      typeof defaultVariant === 'object'
    ) {
      inStock =
        Number(defaultVariant.quantity) > 0;

      console.log(
        '📊 Quantity:',
        defaultVariant.quantity
      );

      console.log(
        '📦 موجود:',
        inStock
      );
    } else {
      // اگر Variant فقط ID باشد
      inStock =
        product.inStock || false;

      console.log(
        '📦 موجودی از Product:',
        inStock
      );
    }
  }

  // ======================================================
  // اگر محصول Variant نداشت
  // ======================================================

  else {
    console.log(
      '❌ محصول هیچ Variant ندارد'
    );

    inStock =
      product.inStock || false;
  }

  // ======================================================
  // استخراج Brand ID
  // ======================================================

  let finalBrandId = null;

  const productBrandId =
    product.brandId;

  console.log(
    '🏷️ brandId خام Product:',
    productBrandId
  );

  // اگر brandId وجود داشته باشد
  if (productBrandId) {
    // ----------------------------------------------------
    // String
    // ----------------------------------------------------

    if (
      typeof productBrandId === 'string'
    ) {
      finalBrandId =
        productBrandId;
    }

    // ----------------------------------------------------
    // Object
    // ----------------------------------------------------

    else if (
      typeof productBrandId === 'object'
    ) {
      finalBrandId =
        productBrandId._id ||
        productBrandId.id ||
        null;
    }
  }

  console.log(
    '🏷️ finalBrandId:',
    finalBrandId
  );

  // ======================================================
  // تصویر
  // ======================================================

  const image =
    product.images &&
    Array.isArray(product.images) &&
    product.images.length > 0
      ? `http://localhost:5000/${product.images[0]}`
      : null;

  // ======================================================
  // تعداد Variant
  // ======================================================

  const variantsCount =
    Array.isArray(product.productVariantIds)
      ? product.productVariantIds.length
      : 0;

  // ======================================================
  // قیمت
  // ======================================================

  const price =
    defaultVariant &&
    typeof defaultVariant === 'object'
      ? (
          defaultVariant.finalPrice ??
          defaultVariant.price ??
          0
        )
      : 0;

  const originalPrice =
    defaultVariant &&
    typeof defaultVariant === 'object'
      ? (
          defaultVariant.price ??
          0
        )
      : 0;

  const discount =
    defaultVariant &&
    typeof defaultVariant === 'object'
      ? (
          defaultVariant.discountPercent ??
          0
        )
      : 0;

  // ======================================================
  // نتیجه نهایی
  // ======================================================

  const result = {
    // Product ID
    id: product._id,

    productId: product._id,

    // اطلاعات محصول
    title:
      product.title ||
      'بدون عنوان',

    image,

    // قیمت
    price,

    originalPrice,

    discount,

    // Rating
    rating:
      product.ratingAvg || 0,

    // Stock
    inStock,

    // Favorite
    isFavorite:
      product.isFavorite || false,

    // Variant
    variantCount:
      variantsCount,

    variants:
      product.productVariantIds || [],

    defaultVariantId,

    defaultVariant,

    // سایر اطلاعات
    slug:
      product.slug,

    description:
      product.description,

    tags:
      product.tags || [],

    // ⭐⭐⭐ بسیار مهم
    brandId:
      finalBrandId,

    categoryIds:
      product.categoryIds || [],
  };

  console.log(
    '✅ محصول پردازش شده:',
    {
      id: result.id,
      title: result.title,
      brandId: result.brandId,
      defaultVariantId:
        result.defaultVariantId,
      inStock: result.inStock,
    }
  );

  return result;
};

// ======================================================
// Products Component
// ======================================================

export default function Products() {
  const theme = useTheme();

  const isDark =
    theme.palette.mode === 'dark';

  // ====================================================
  // State
  // ====================================================

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [totalCount, setTotalCount] =
    useState(0);

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [snackbar, setSnackbar] =
    useState({
      open: false,
      message: '',
      severity: 'success',
    });

  // تعداد محصول در هر صفحه
  const LIMIT = 12;

  // ====================================================
  // دریافت محصولات
  // ====================================================

  useEffect(() => {
    const fetchProducts =
      async () => {
        try {
          setLoading(true);
          setError(null);

          const res =
            await fetch(
              `http://localhost:5000/api/products?page=${page}&limit=${LIMIT}`
            );

          if (!res.ok) {
            throw new Error(
              `خطا در دریافت محصولات: ${res.status}`
            );
          }

          const data =
            await res.json();

          console.log(
            '📦 پاسخ کامل API:',
            data
          );

          // ==============================================
          // بررسی Data
          // ==============================================

          if (
            data &&
            Array.isArray(data.data)
          ) {
            console.log(
              '📦 تعداد محصولات:',
              data.data.length
            );

            // ==========================================
            // بررسی اولین محصول
            // ==========================================

            if (data.data.length > 0) {
              console.log(
                '📦 اولین Product:',
                data.data[0]
              );

              console.log(
                '🏷️ brandId اولین Product:',
                data.data[0].brandId
              );

              console.log(
                '📦 Variantهای اولین Product:',
                data.data[0]
                  .productVariantIds
              );
            }

            // ==========================================
            // پردازش محصولات
            // ==========================================

            const processedProducts =
              data.data
                .map(
                  (product) =>
                    processProductToCard(
                      product
                    )
                )
                .filter(
                  (item) =>
                    item !== null
                );

            console.log(
              '✅ محصولات پردازش شده:',
              processedProducts
            );

            setProducts(
              processedProducts
            );

            // ==========================================
            // تعداد کل
            // ==========================================

            const count =
              data.count || 0;

            setTotalCount(count);

            // ==========================================
            // Pagination
            // ==========================================

            setTotalPages(
              Math.max(
                1,
                Math.ceil(
                  count / LIMIT
                )
              )
            );
          } else {
            setProducts([]);
            setTotalCount(0);
            setTotalPages(1);
          }
        } catch (err) {
          console.error(
            '❌ خطا در دریافت محصولات:',
            err
          );

          setError(
            err.message ||
              'مشکلی در دریافت محصولات پیش آمده'
          );
        } finally {
          setLoading(false);
        }
      };

    fetchProducts();
  }, [page]);

  // ====================================================
  // Favorite
  // ====================================================

  const handleFavoriteToggle =
    async (productId) => {
      try {
        const token =
          localStorage.getItem(
            'token'
          );

        if (!token) {
          window.location.href =
            '/login';

          return;
        }

        const res =
          await fetch(
            'http://localhost:5000/api/products/toggle-favorite',
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                productId,
              }),
            }
          );

        if (!res.ok) {
          throw new Error(
            'خطا در تغییر وضعیت علاقه‌مندی'
          );
        }

        const data =
          await res.json();

        console.log(
          '✅',
          data.message
        );

        setProducts(
          (prev) =>
            prev.map(
              (p) =>
                p.id === productId
                  ? {
                      ...p,
                      isFavorite:
                        !p.isFavorite,
                    }
                  : p
            )
        );
      } catch (err) {
        console.error(
          '❌ خطا در Favorite:',
          err
        );
      }
    };

  // ====================================================
  // Add To Cart
  // ====================================================

  const handleAddToCart =
    async (productId) => {
      try {
        console.log(
          '🛒 شروع افزودن به سبد خرید:',
          productId
        );

        // ==============================================
        // بررسی Token
        // ==============================================

        const token =
          localStorage.getItem(
            'token'
          );

        if (!token) {
          setSnackbar({
            open: true,
            message:
              'لطفاً ابتدا وارد حساب خود شوید',
            severity: 'warning',
          });

          setTimeout(() => {
            window.location.href =
              '/login';
          }, 2000);

          return;
        }

        // ==============================================
        // پیدا کردن Product
        // ==============================================

        const product =
          products.find(
            (p) =>
              p.id === productId
          );

        console.log(
          '📦 Product پیدا شده:',
          product
        );

        if (!product) {
          setSnackbar({
            open: true,
            message:
              'محصول یافت نشد',
            severity: 'error',
          });

          return;
        }

        // ==============================================
        // بررسی موجودی
        // ==============================================

        if (!product.inStock) {
          setSnackbar({
            open: true,
            message:
              'متأسفیم، این محصول موجود نیست',
            severity: 'error',
          });

          return;
        }

        // ==============================================
        // پیدا کردن Variant ID
        // ==============================================

        let productVariantId =
          product.defaultVariantId;

        console.log(
          '🎯 defaultVariantId:',
          productVariantId
        );

        // اگر Default Variant نداشت
        if (
          !productVariantId &&
          product.variants &&
          product.variants.length > 0
        ) {
          const firstVariant =
            product.variants[0];

          if (
            typeof firstVariant ===
            'object'
          ) {
            productVariantId =
              firstVariant._id ||
              firstVariant.id ||
              null;
          } else {
            productVariantId =
              firstVariant;
          }

          console.log(
            '🔄 Variant اول:',
            productVariantId
          );
        }

        // ==============================================
        // بررسی Variant
        // ==============================================

        if (!productVariantId) {
          setSnackbar({
            open: true,
            message:
              'تنوع محصول یافت نشد',
            severity: 'error',
          });

          console.error(
            '❌ productVariantId پیدا نشد:',
            product
          );

          return;
        }

        // ==============================================
        // استخراج Brand ID
        // ==============================================

        let finalBrandId = null;

        console.log(
          '🏷️ brandId موجود در Product:',
          product.brandId
        );

        if (product.brandId) {
          if (
            typeof product.brandId ===
            'string'
          ) {
            finalBrandId =
              product.brandId;
          } else if (
            typeof product.brandId ===
            'object'
          ) {
            finalBrandId =
              product.brandId._id ||
              product.brandId.id ||
              null;
          }
        }

        console.log(
          '🏷️ finalBrandId:',
          finalBrandId
        );

        // ==============================================
        // بررسی Brand ID
        // ==============================================

        if (!finalBrandId) {
          setSnackbar({
            open: true,
            message:
              'شناسه برند محصول یافت نشد',
            severity: 'error',
          });

          console.error(
            '❌ brandId معتبر نیست:',
            product
          );

          return;
        }

        // ==============================================
        // ساخت Body
        // ==============================================

        const cartData = {
          productVariantId:
            productVariantId,

          brandId:
            finalBrandId,

          cartQuantity: 1,
        };

        console.log(
          '📤 Body ارسالی به Cart:',
          JSON.stringify(
            cartData,
            null,
            2
          )
        );

        // ==============================================
        // POST /carts/add
        // ==============================================

        const response =
          await fetch(
            'http://localhost:5000/api/carts/add',
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify(
                cartData
              ),
            }
          );

        console.log(
          '📥 Status:',
          response.status
        );

        // ==============================================
        // دریافت Response
        // ==============================================

        const responseText =
          await response.text();

        console.log(
          '📥 Response:',
          responseText
        );

        let result;

        try {
          result =
            JSON.parse(
              responseText
            );
        } catch (error) {
          console.error(
            '❌ JSON نامعتبر:',
            responseText
          );

          throw new Error(
            'پاسخ سرور معتبر نیست'
          );
        }

        console.log(
          '📦 Result:',
          result
        );

        // ==============================================
        // Error
        // ==============================================

        if (!response.ok) {
          throw new Error(
            result.message ||
              result.error ||
              'خطا در افزودن به سبد خرید'
          );
        }

        // ==============================================
        // Success
        // ==============================================

        setSnackbar({
          open: true,
          message:
            result.message ||
            'محصول با موفقیت به سبد خرید اضافه شد',
          severity: 'success',
        });

        console.log(
          '✅ محصول با موفقیت به Cart اضافه شد'
        );
      } catch (err) {
        console.error(
          '❌ خطا در Add To Cart:',
          err
        );

        setSnackbar({
          open: true,
          message:
            err.message ||
            'خطا در افزودن به سبد خرید',
          severity: 'error',
        });
      }
    };

  // ====================================================
  // Close Snackbar
  // ====================================================

  const handleCloseSnackbar =
    (event, reason) => {
      if (
        reason === 'clickaway'
      ) {
        return;
      }

      setSnackbar(
        (prev) => ({
          ...prev,
          open: false,
        })
      );
    };

  // ====================================================
  // Loading
  // ====================================================

  if (loading) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          py: 4,
        }}
      >
        <Box
          sx={{
            display: 'grid',

            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },

            gap: 2,
          }}
        >
          {[
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
          ].map((i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={460}
              sx={{
                borderRadius: 3,
              }}
            />
          ))}
        </Box>
      </Container>
    );
  }

  // ====================================================
  // Error
  // ====================================================

  if (error) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          py: 8,
        }}
      >
        <Alert
          severity="error"
          variant="filled"
          sx={{
            borderRadius: 3,
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  // ====================================================
  // UI
  // ====================================================

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 4,
        direction: 'rtl',
      }}
    >
      {/* Header */}

      <Box
        sx={{
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,

            background:
              'linear-gradient(135deg, #FF6F00, #FF8C00)',

            WebkitBackgroundClip:
              'text',

            WebkitTextFillColor:
              'transparent',
          }}
        >
          محصولات
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: isDark
              ? '#777'
              : '#999',

            fontWeight: 500,
          }}
        >
          {totalCount} محصول
        </Typography>
      </Box>

      {/* Products */}

      {products.length === 0 ? (
        <Box
          sx={{
            py: 12,
            textAlign: 'center',
            borderRadius: 4,

            border:
              '1px dashed rgba(255, 140, 0, 0.3)',

            backgroundColor:
              isDark
                ? 'rgba(255,140,0,0.05)'
                : '#FFF8F0',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: isDark
                ? '#888'
                : '#666',

              mb: 1,
            }}
          >
            😕 محصولی یافت نشد
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            لطفاً عبارت جستجو را تغییر دهید
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',

            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },

            gap: 2,

            justifyContent:
              'center',
          }}
        >
          {products.map(
            (product) => (
              <Box
                key={product.id}
                sx={{
                  display: 'flex',
                  justifyContent:
                    'center',
                }}
              >
                <ProductCard
                  {...product}

                  onFavoriteToggle={() =>
                    handleFavoriteToggle(
                      product.id
                    )
                  }

                  onAddToCart={() =>
                    handleAddToCart(
                      product.id
                    )
                  }
                />
              </Box>
            )
          )}
        </Box>
      )}

      {/* Pagination */}

      {totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent:
              'center',

            mt: 4,
            pt: 3,

            borderTop:
              '1px solid ' +
              (
                isDark
                  ? 'rgba(255,255,255,0.06)'
                  : 'rgba(0,0,0,0.06)'
              ),
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={(
              event,
              value
            ) =>
              setPage(value)
            }
            color="primary"
            size="large"
            sx={{
              direction: 'ltr',

              '& .MuiPaginationItem-root':
                {
                  borderRadius: 2,

                  color: isDark
                    ? '#aaa'
                    : 'inherit',

                  '&.Mui-selected':
                    {
                      backgroundColor:
                        '#FF8C00',

                      color:
                        '#fff',

                      '&:hover':
                        {
                          backgroundColor:
                            '#E65100',
                        },
                    },
                },
            }}
          />
        </Box>
      )}

      {/* Snackbar */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={
          handleCloseSnackbar
        }
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Alert
          onClose={
            handleCloseSnackbar
          }
          severity={
            snackbar.severity
          }
          variant="filled"
          sx={{
            borderRadius: 3,
            width: '100%',

            boxShadow:
              '0 8px 30px rgba(0,0,0,0.2)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}