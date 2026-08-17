---
description: "Meet the maintainers and contributors behind the Ts.ED project."
layout: home
hero:
  name: "Our Team"
  tagline: "The development of Ts.ED and its ecosystem is guided by an international team (it's our goal).
We have a very active and engaged team that is constantly striving to push Ts.ED forward."
---

<script setup>
import { VPTeamMembers } from 'vitepress/theme';
import team from '../team.json';

const members = team.map((member) => {
   return {
     avatar: member.src,
     name: member.title,
     title: member.role + ' - ' + member.job,
     links: [
        { icon: 'github', link: 'https://github.com/' + member.github },
        member.twitter && { icon: 'twitter', link: 'https://x.com/' + member.twitter }
     ].filter(Boolean)
   }
})
</script>

<div class="text-2xl sm:text-5xl text-center pb-5">Team members</div>

<VPTeamMembers animate size="small" :members="members" />

<HomeContainer animate>
<div class="flex flex-col sm:flex-row pt-10 sm:pt-20 gap-10">
<div class="flex items-center order-first sm:order-last">
    <div class="flex sm:block">
      <div class="text-2xl sm:text-5xl flex items-center pb-5">
        <div>Our awesome <strong>contributors</strong></div>
      </div>
      <div class="max-w-[100px] relative">
        <div
          class="animate-[ping_3s_infinite] absolute inline-flex h-full rounded-full bg-red-400 opacity-75 w-[100px]"
        />
        <MessageCircleHeart class="w-[100px] z-2 relative" />
      </div>
    </div>
  </div>

  <GithubContributors />

</div>
</HomeContainer>
