import { Link } from "react-router";
import { articles } from "./articles";
import { Heading } from "../shared/Heading";

const Article = () => {

  return (
    <section className="home-section bg-base-100">
      <div className="home-container">
        <Heading
          title="Recent News Articles"
          subtitle="Fresh job related news content posted each day."
        />


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles?.map((article) => (
            <div
              key={article.id}
              className="home-card overflow-hidden"
            >
              <img
                src={article.image}
                alt={article.title}
                loading="lazy"
                className="w-full h-48 sm:h-52 object-cover"
              />

              <div className="p-6">
                <div className="card-body-text mb-2 flex flex-wrap items-center gap-2">
                  <span className="home-chip">{article.category}</span>
                  <span>{article.date}</span>•<span>{article.readTime} read</span>
                </div>

                <h3 className="card-title mb-2 line-clamp-2">{article.title}</h3>
                <p className="card-body-text mb-4 line-clamp-3">{article.excerpt}</p>

             <Link to={`/article/${article.id}`} className="btn-brand-gradient">
    Read More
</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Article;
