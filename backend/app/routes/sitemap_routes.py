from flask import Blueprint, Response
from datetime import datetime
from app.models.product import Product
from app.models.category import Category

sitemap_bp = Blueprint("sitemap", __name__)

@sitemap_bp.route("/sitemap.xml", methods=["GET"])
def sitemap():
    products = Product.query.all()
    categories = Category.query.all()

    base_url = "https://www.smartnestsolutionskenya.com"
    today = datetime.utcnow().strftime('%Y-%m-%d')

    urls = []
    urls.append(f"<url><loc>{base_url}/</loc><lastmod>{today}</lastmod><priority>1.0</priority></url>")
    urls.append(f"<url><loc>{base_url}/products</loc><lastmod>{today}</lastmod><priority>0.9</priority></url>")

    for c in categories:
        urls.append(f"<url><loc>{base_url}/category/{c.slug}</loc><lastmod>{today}</lastmod><priority>0.7</priority></url>")

    for p in products:
        identifier = getattr(p, 'slug', None) or p.id
        urls.append(f"<url><loc>{base_url}/products/{identifier}</loc><lastmod>{today}</lastmod><priority>0.8</priority></url>")

    xml = ('<?xml version="1.0" encoding="UTF-8"?>\n'
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
           + '\n'.join(urls) + '\n</urlset>')

    return Response(xml, mimetype='application/xml')