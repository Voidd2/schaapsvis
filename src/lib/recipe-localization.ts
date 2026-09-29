import { type Recept, receptBeeld } from "./recepten";
import { RECIPE_TRANSLATIONS } from "./recipe-translations";
import { siteLanguage } from "./language";
import { receptMinuten, receptVis } from "./recept-hulp";
import { recipeTime, recipeLabel } from "./recipe-copy";
export type LocalizedRecipe = Recept & {minutes:number;fishType:string;sourceTime:string};
export function localizeRecipe(recipe:Recept,locale:string):LocalizedRecipe {
 const lang=siteLanguage(locale),extra={minutes:receptMinuten(recipe.tijd),sourceTime:recipe.tijd,fishType:recipeLabel(receptVis(recipe),lang)};
 if(lang==="nl")return {...recipe,...extra};
 const t=RECIPE_TRANSLATIONS[recipe.slug]?.[lang];if(!t)throw new Error(`Missing ${lang} recipe: ${recipe.slug}`);
 if(t.fish.length!==recipe.vanSchaap.length||t.pantry.length!==recipe.vanSupermarkt.length||t.steps.length!==recipe.bereidingswijze.length)throw new Error(`Recipe translation item count mismatch: ${lang}/${recipe.slug}`);
 for(const field of ["veiligheid","keuken","seizoen","highlight"] as const){const target={veiligheid:t.safety,keuken:t.cuisine,seizoen:t.season,highlight:t.highlight}[field];if(recipe[field]&&!target)throw new Error(`Missing ${lang}/${recipe.slug}/${field}`);}
 return {...recipe,...extra,title:t.title,subtitle:t.subtitle,verhaal:t.story,vanSchaap:t.fish,vanSupermarkt:t.pantry,bereidingswijze:t.steps,fotoLabel:t.photo,veiligheid:t.safety,keuken:t.cuisine,seizoen:t.season,highlight:t.highlight,tijd:recipeTime(recipe.tijd,lang),seoKeywords:`${t.title}, ${t.subtitle}`};
}
export function localizedRecipeImage(recipe:Recept){return {...receptBeeld(recipe),alt:recipe.fotoLabel};}
