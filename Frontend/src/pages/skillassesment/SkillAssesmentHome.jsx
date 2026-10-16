import React from 'react'
import { AssesmentBanner } from './assessment.ui/AssesmentBanner'
import { SkillSection } from './SkillSection'

export const SkillAssesmentHome = () => {
  return (
  <React.Fragment>
  <AssesmentBanner/>

  <div>
    <SkillSection/>
  </div>
  </React.Fragment>
  )
}
