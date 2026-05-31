import HeroSection from '../sections/HeroSection'
import TodaysTipsFeed from '../sections/TodaysTipsFeed'
import PredictionsBanner from '../sections/PredictionsBanner'
import TrendingTopics from '../sections/TrendingTopics'
import SulitFoodSection from '../sections/SulitFoodSection'
import CategoriesSection from '../sections/CategoriesSection'
import CTASection from '../sections/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TodaysTipsFeed />
      <PredictionsBanner />
      <TrendingTopics />
      <SulitFoodSection />
      <CategoriesSection />
      <CTASection />
    </>
  )
}
