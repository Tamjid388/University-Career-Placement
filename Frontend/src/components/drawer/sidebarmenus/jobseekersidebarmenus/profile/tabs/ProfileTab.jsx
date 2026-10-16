import React, { useState } from 'react';

import { SocialProfiles } from '../profileforms/SocialProfiles';
import { EducationForm } from '../profileforms/EducationForm';
import { AboutForm } from '../profileforms/AboutForm';
import { WorkExperienceForm } from '../profileforms/WorkExperienceFrom';
import { SkillForms } from '../profileforms/SkillForms';



export const ProfileTab = () => {


  return (
   <div>
     
    <AboutForm/>
    <SkillForms/>
    <SocialProfiles/>
    <EducationForm/>
    <WorkExperienceForm/>
   </div>
  );
};

