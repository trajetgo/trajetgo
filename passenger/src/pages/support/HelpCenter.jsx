import HelpHero from "../../components/support/HelpHero";
import HelpCategories from "../../components/support/HelpCategories";
import PopularArticles from "../../components/support/PopularArticles";
import NeedHelp from "../../components/support/NeedHelp";
import '../../styles/pages/support/HelpCenter.scss';

export default function HelpCenter() {
  return (
    <section className="help-center">
      <HelpHero />
      <HelpCategories />
      <PopularArticles />
      <NeedHelp />
    </section>
  )
}
