import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey, CacheTTL,
  Controller, Get, Inject, Req, UseInterceptors
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { Product } from "./product";
import { Cache } from "cache-manager";
import { Request } from "express";

@Controller("products")
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
  }

  @CacheKey("products_frontend")
  @CacheTTL(1800)
  @UseInterceptors(CacheInterceptor)
  @Get("frontend")
  async frontend() {
    return this.productService.find();
  }

  @Get("backend")
  async backend(
    @Req() request: Request
  ) {
    let products = await this.cacheManager.get<Product[]>("products_backend");

    if (!products) {
      products = await this.productService.find();

      await this.cacheManager.set("products_backend", products, { ttl: 1800 });
    }

    if (request.query.s) {
      const s = request.query.s.toString().toLowerCase();
      products = products.filter(p => p.title.toLowerCase().indexOf(s) >= 0 ||
        p.description.toLowerCase().indexOf(s) >= 0);
    }

    if (request.query.sort === "asc" || request.query.sort === "desc") {
      products.sort((a, b) => {
        const diff = a.price - b.price;

        if (diff === 0) return 0;

        const sign = Math.abs(diff) / diff; //-1,1

        return request.query.sort === "asc" ? sign : -sign;
      });
    }

    const page: number = parseInt(request.query.page as any) || 1;
    const perPage = 9;
    const total = products.length;

    const data = products.slice((page - 1) * perPage, page * perPage);

    return {
      data,
      total,
      page,
      last_page: Math.ceil(total / perPage)
    };
  }
}
