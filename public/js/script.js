document.addEventListener("DOMContentLoaded", () => {
  const titleEl = document.getElementById("poemTitle");
  const textEl = document.getElementById("poemText");
  const buttons = document.querySelectorAll(".toc-item");

  // Not on poetry page? Exit safely.
  if (!titleEl || !textEl || buttons.length === 0) return;

  const poems = {
    featured: {
      title: "A Set of Three",
      text: `Three hearts, three souls…
Entangled in life’s chaotic show.
Eyes once filled with innocence and love,
Cries ocean on what has become.

All that’s left is rage and guilt,
Questioning everything that was built.
Each made a promise to stay,
Only to watch everything fade away.

Love’s no garden of endless roses,
A fire that burnt fierce, now dark and frozen.
A desperate plea to stay strong,
The battle between right and wrong.

Heart or mind—what would be your choice?
Misery follows regardless, cannot avoid.
Imprisoned by the hands of fate,
Inner calling to break free of the torment.

A heart once broken, torn in pain,
Piece by piece, you’ll rise again.`
    },
    p2: { title: "Ending of a Friendship", text: `Grateful for all the time
You were there for me,
In the face of life,
When you stood beside me.

The heartache faded
Merely by your presence.
You mended my heart
By just being a friend.

You came in like a pond
In an endless desert.
I guess it was just another mirage,
An illusion that this would last forever.

But alas, call me a bad friend—
I can’t, for I am far too hurt
By your cheap comments,
And a nonchalance that hurts.

There is no point for me to stay,
Maybe I couldn’t always mend.
Forgive me, for I don’t know
How to be a good friend.

Apologies for all the times
I hurt you unintentionally,
Or the times I chose to let go
Instead of trying, intentionally.

In the hope that you will
Choose to forgive me,
And that, my friend,
Is my final plea.

For I don’t know how to be a friend—
Please know, I am trying.` },
    p3: { title: "Trauma to Survive", text: `Demon face, demon touch,
Fancy dinner, whiskey flush.
Anxiety dances as he comes close—
What to do? I froze.

Don’t think, it will go away.
Fooled mind—body says not okay.
Sleepless, anxious nights,
Haunting memories, overthinking invites.

Why me? Cry me.
If only I was not that free.
Next day, pretend everything is fine,
While spark and soul slowly die.

Find a distraction from this torture—
A girl once seeking attention
Now looks for a corner.

Will these marks turn into scars I keep?
Will I carry them with me
As long as I live?` },
    p4: { title: "Where Are Tears?", text: `As the tension lingers all over my body,
like I don't have access to my own feelings.

Imprisoned by my own emotions,
I want an out from this torture,
praying and hoping
to see the end of it.

I want to break down and break free,
close the chapter and finally be me.

Chest pounding, breath racing,
mind wandering, as I stare at nothing.

Longing for a good cry—
why am I portraying everything is alright?
Restlessly searching for tears,
like a mother looking for her child.

No idea what I am going home to,
sadness takes over at the thought of you.

When will I be in peace?
i am done sacrificing my needs.
For there is no bad blood,
I just want myself back.` },
    p5: { title: "Not Today!", text: `I hit the floor,
for I can no longer
pretend that I am fine.
For I just wanna crash
into someone’s arms.

And break off the shield—
I no longer wanna portray
that I have my shit together.
For I just wanna shed a tear
into someone’s arms.

When life throws consecutive
loses in your face,
when you sense hatered
in everyone’s face,
please come as a shelter
to crash in like a home.

Someone who wants to understand me
in the world that runs on misunderstanding.
It’s not like it’s an everyday need,
but today I look at the sky and plead.

Pillow soaked with salt water.
It feels overwhelming to carry, so I open
the gram to scroll away my sufferings.

For I don’t wanna be
strong independent woman today.
So I let the algorithm decide
what ride it wants to take me on.` },
    p6: { title: "When Fate Doesn’t Align", text: `Maybe if I stopped searching
for you at every station,
maybe if I stopped looking
forward to every function,

hoping you would be there—
will the fates align?
Wishing to see you in unknown faces,
will our paths collide?

What if destiny gave us
one more chance?
Praying this time we are
dealt with winning cards.

Falling in love in this era
is tricker than ever.
Exhausted from apps,
so I keep longing forever.` }
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;

      if (!poems[key]) {
        console.error("No poem found for key:", key);
        return;
      }

      // active state
      buttons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      // swap content
      titleEl.textContent = poems[key].title;
      textEl.textContent = poems[key].text;

      // on mobile, scroll reader into view
      if (window.matchMedia("(max-width: 900px)").matches) {
        titleEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});



