/**
 * Fantasy D&D-inspired CYOA Story: "The Dragon's Dilemma"
 */

const dragonsDilemmaStory = {
    title: "The Dragon's Dilemma",
    description: "A fantasy adventure where your choices and dice rolls determine your fate",
    nodes: {
        start: {
            id: 'start',
            title: 'The Tavern',
            text: `You sit in the dimly lit Crimson Drake tavern, nursing your ale. The fire crackles, casting dancing shadows on the worn wooden walls. Suddenly, a hooded figure approaches your table.

"Adventurer," the figure whispers urgently, "I seek someone brave enough to enter the Cursed Ruins of Dragonspire. An ancient artifact must be retrieved before the dark cultists claim it. Will you help?"

The hood falls back, revealing an elderly wizard with worried eyes.`,
            choices: [
                {
                    id: 'accept',
                    text: 'Accept the quest (🗡️ Begin adventure)',
                    nextNode: 'wizard_explains'
                },
                {
                    id: 'negotiate',
                    text: 'Ask about payment (💰 Charisma check)',
                    skillCheck: { skill: 'charisma', difficulty: 12 },
                    successNode: 'negotiate_success',
                    failNode: 'negotiate_fail'
                },
                {
                    id: 'refuse',
                    text: 'Politely decline',
                    nextNode: 'refuse_ending'
                }
            ]
        },
        
        wizard_explains: {
            id: 'wizard_explains',
            title: 'The Quest',
            text: `"Excellent!" The wizard's eyes light up. "The artifact is the Eye of Bahamut, a gem that can reveal truth and dispel illusions. The cultists serve Tiamat and seek to use it for dark purposes."

He spreads a map on the table. "The ruins are a day's journey north. You'll face dangers: the outer courtyard with its guardian constructs, the inner chambers with ancient traps, and finally the vault itself. Choose your starting equipment wisely."`,
            choices: [
                {
                    id: 'sword_shield',
                    text: 'Take sword and shield (⚔️ +2 Strength)',
                    effects: { 
                        addItem: 'longsword',
                        addItem: 'shield',
                        modifyStat: { stat: 'strength', amount: 2 }
                    },
                    nextNode: 'journey_begins'
                },
                {
                    id: 'magic_scroll',
                    text: 'Take spellbook and scrolls (📜 +2 Wisdom)',
                    effects: { 
                        addItem: 'spellbook',
                        addItem: 'healing_scroll',
                        modifyStat: { stat: 'wisdom', amount: 2 }
                    },
                    nextNode: 'journey_begins'
                },
                {
                    id: 'lockpicks',
                    text: 'Take lockpicks and rope (🔓 +2 Luck)',
                    effects: { 
                        addItem: 'lockpicks',
                        addItem: 'rope',
                        modifyStat: { stat: 'luck', amount: 2 }
                    },
                    nextNode: 'journey_begins'
                }
            ]
        },

        negotiate_success: {
            id: 'negotiate_success',
            title: 'Skilled Negotiator',
            text: `The wizard nods appreciatively at your business acumen. "Very well. I offer 500 gold pieces now, and 1,000 more upon your successful return with the Eye of Bahamut."

He places a heavy coin purse on the table. Your charisma has served you well!`,
            choices: [
                {
                    id: 'accept_deal',
                    text: 'Accept the generous offer',
                    effects: { 
                        addItem: 'gold_500',
                        modifyStat: { stat: 'charisma', amount: 1 }
                    },
                    nextNode: 'wizard_explains'
                }
            ]
        },

        negotiate_fail: {
            id: 'negotiate_fail',
            title: 'Negotiation Failed',
            text: `The wizard frowns. "I see you are motivated by coin rather than righteousness. Very well, I shall find another..." He begins to turn away.

"Wait!" you call out, realizing you may have offended him. Sometimes honor speaks louder than gold.`,
            choices: [
                {
                    id: 'apologize',
                    text: 'Apologize and accept the quest',
                    nextNode: 'wizard_explains'
                },
                {
                    id: 'let_leave',
                    text: 'Let him leave',
                    nextNode: 'refuse_ending'
                }
            ]
        },

        journey_begins: {
            id: 'journey_begins',
            title: 'The Road North',
            text: `You set out at dawn, the road stretching before you through forest and hills. By afternoon, you spot the ancient ruins atop a distant cliff. As you approach, you notice fresh tracks in the mud—someone else has been here recently.

The outer courtyard looms before you, its massive stone gates hanging open. In the center, you see two ancient stone guardians. They appear dormant... for now.`,
            choices: [
                {
                    id: 'sneak_past',
                    text: 'Try to sneak past the guardians (🎲 Luck check DC 14)',
                    skillCheck: { skill: 'luck', difficulty: 14 },
                    successNode: 'sneak_success',
                    failNode: 'combat_guardians'
                },
                {
                    id: 'examine_guardians',
                    text: 'Examine the guardians more closely (🔍 Wisdom check DC 12)',
                    skillCheck: { skill: 'wisdom', difficulty: 12 },
                    successNode: 'examine_success',
                    failNode: 'examine_fail'
                },
                {
                    id: 'charge_through',
                    text: 'Charge through quickly (⚡ Strength check DC 13)',
                    skillCheck: { skill: 'strength', difficulty: 13 },
                    successNode: 'charge_success',
                    failNode: 'combat_guardians'
                }
            ]
        },

        sneak_success: {
            id: 'sneak_success',
            title: 'Silent as Shadow',
            text: `You move with practiced stealth, keeping to the shadows along the courtyard walls. The guardians' stone heads track movement in the center, but they don't notice your careful approach. You slip past them undetected!

You find yourself at the entrance to the inner chambers. The air grows cold, and ancient runes glow faintly on the walls.`,
            choices: [
                {
                    id: 'enter_chambers',
                    text: 'Enter the inner chambers',
                    nextNode: 'inner_chambers'
                }
            ]
        },

        examine_success: {
            id: 'examine_success',
            title: 'Ancient Knowledge',
            text: `Your knowledge of ancient magic serves you well. You recognize these as Warding Constructs—they only activate when something crosses the center line of the courtyard. You also notice a faded inscription: "Only the true of heart may walk the honored path."

There's a narrow walkway along the edges that appears safe!`,
            effects: { setFlag: { key: 'knows_guardian_secret', value: true } },
            choices: [
                {
                    id: 'use_walkway',
                    text: 'Use the safe walkway',
                    nextNode: 'sneak_success'
                },
                {
                    id: 'test_center',
                    text: 'Test the center path anyway',
                    nextNode: 'combat_guardians'
                }
            ]
        },

        examine_fail: {
            id: 'examine_fail',
            title: 'Uncertain Path',
            text: `You study the guardians but can't discern any special properties. They appear to be simple stone statues, though something about them makes you uneasy.`,
            choices: [
                {
                    id: 'walk_center',
                    text: 'Walk through the center',
                    nextNode: 'combat_guardians'
                },
                {
                    id: 'try_edges',
                    text: 'Try the edges instead (🎲 Luck check DC 10)',
                    skillCheck: { skill: 'luck', difficulty: 10 },
                    successNode: 'sneak_success',
                    failNode: 'combat_guardians'
                }
            ]
        },

        charge_success: {
            id: 'charge_success',
            title: 'Quick Reflexes',
            text: `You sprint through the courtyard with impressive speed! The guardians begin to move, their stone limbs grinding, but you're already past them before they can fully activate. Your athletic prowess has saved you!`,
            choices: [
                {
                    id: 'continue',
                    text: 'Continue to inner chambers',
                    nextNode: 'inner_chambers'
                }
            ]
        },

        combat_guardians: {
            id: 'combat_guardians',
            title: 'Guardian Combat!',
            text: `The stone guardians activate with a grinding roar! Their eyes glow red as they turn toward you. You must fight or find another way!`,
            choices: [
                {
                    id: 'fight_strength',
                    text: 'Fight with strength! (⚔️ Roll 2d6+Strength DC 14)',
                    requires: { item: 'longsword' },
                    diceRoll: { sides: 6, count: 2, target: 14 },
                    successNode: 'combat_victory',
                    failNode: 'combat_defeat'
                },
                {
                    id: 'use_magic',
                    text: 'Use magic to disable them (✨ Roll 2d6+Wisdom DC 13)',
                    requires: { item: 'spellbook' },
                    diceRoll: { sides: 6, count: 2, target: 13 },
                    successNode: 'magic_victory',
                    failNode: 'combat_defeat'
                },
                {
                    id: 'find_weakness',
                    text: 'Look for a weakness (🔍 Roll 2d6+Luck DC 12)',
                    diceRoll: { sides: 6, count: 2, target: 12 },
                    successNode: 'weakness_found',
                    failNode: 'combat_defeat'
                },
                {
                    id: 'retreat',
                    text: 'Retreat and try another approach',
                    nextNode: 'retreat_option'
                }
            ]
        },

        combat_victory: {
            id: 'combat_victory',
            title: 'Victory!',
            text: `Your blade strikes true! The first guardian crumbles under your assault, and the second falls moments later. Stone fragments litter the courtyard as silence returns. You've proven your combat prowess!`,
            effects: { modifyStat: { stat: 'strength', amount: 1 } },
            choices: [
                {
                    id: 'proceed',
                    text: 'Proceed to inner chambers',
                    nextNode: 'inner_chambers'
                }
            ]
        },

        magic_victory: {
            id: 'magic_victory',
            title: 'Magical Triumph',
            text: `Your spell unravels the ancient magic animating the guardians! They freeze in place, then slowly crumble to inert stone. Your magical knowledge has saved the day!`,
            effects: { modifyStat: { stat: 'wisdom', amount: 1 } },
            choices: [
                {
                    id: 'proceed',
                    text: 'Proceed to inner chambers',
                    nextNode: 'inner_chambers'
                }
            ]
        },

        weakness_found: {
            id: 'weakness_found',
            title: 'Clever Solution',
            text: `You spot the control runes on the back of their necks! With careful timing, you disable both guardians by covering these runes with your cloak. They power down harmlessly. Clever thinking!`,
            effects: { modifyStat: { stat: 'luck', amount: 1 } },
            choices: [
                {
                    id: 'proceed',
                    text: 'Proceed to inner chambers',
                    nextNode: 'inner_chambers'
                }
            ]
        },

        combat_defeat: {
            id: 'combat_defeat',
            title: 'Narrow Escape',
            text: `The guardians prove too powerful! A massive stone fist catches you, sending you flying backward. You crash through a weakened wall, tumbling into darkness...

You wake up in a secret passage you hadn't noticed before. Your body aches, but you're alive. Perhaps this alternate route will prove safer.`,
            choices: [
                {
                    id: 'follow_passage',
                    text: 'Follow the secret passage',
                    nextNode: 'secret_passage'
                }
            ]
        },

        retreat_option: {
            id: 'retreat_option',
            title: 'Tactical Retreat',
            text: `You back away carefully, and the guardians return to their dormant state once you're outside the courtyard. You notice a side entrance partially hidden by vines...`,
            choices: [
                {
                    id: 'side_entrance',
                    text: 'Try the side entrance',
                    nextNode: 'secret_passage'
                },
                {
                    id: 'try_again',
                    text: 'Try the main entrance again',
                    nextNode: 'journey_begins'
                }
            ]
        },

        secret_passage: {
            id: 'secret_passage',
            title: 'Hidden Ways',
            text: `The secret passage winds through the ruins' foundations. Ancient torches flicker to life as you pass, revealing murals depicting dragons—both chromatic and metallic—in eternal conflict.

You emerge in a chamber behind the main entrance, bypassing the guardians entirely. Sometimes the indirect path is wisest.`,
            effects: { modifyStat: { stat: 'wisdom', amount: 1 } },
            choices: [
                {
                    id: 'continue_quest',
                    text: 'Continue deeper into the ruins',
                    nextNode: 'inner_chambers'
                }
            ]
        },

        inner_chambers: {
            id: 'inner_chambers',
            title: 'The Inner Sanctum',
            text: `The inner chambers are vast and filled with ancient pillars. Ahead, you see three doors, each marked with a different symbol: a sword, a book, and a dragon.

Before you can choose, you hear voices—the cultists are here! You hear them arguing behind the dragon door about how to open the final vault.`,
            choices: [
                {
                    id: 'sword_door',
                    text: 'Take the sword door (⚔️ Test of combat)',
                    nextNode: 'sword_trial'
                },
                {
                    id: 'book_door',
                    text: 'Take the book door (📚 Test of knowledge)',
                    nextNode: 'book_trial'
                },
                {
                    id: 'dragon_door',
                    text: 'Take the dragon door (🐉 Face the cultists)',
                    nextNode: 'cultist_confrontation'
                },
                {
                    id: 'wait_listen',
                    text: 'Hide and listen to the cultists (🔍 Wisdom check DC 11)',
                    skillCheck: { skill: 'wisdom', difficulty: 11 },
                    successNode: 'learn_secret',
                    failNode: 'caught_listening'
                }
            ]
        },

        sword_trial: {
            id: 'sword_trial',
            title: 'Trial of Combat',
            text: `You enter a circular arena. Ancient magic activates, and spectral warriors materialize around you! This is a trial of martial prowess.`,
            choices: [
                {
                    id: 'fight_spectres',
                    text: 'Fight the spectral warriors (⚔️ Roll 3d6 DC 15)',
                    diceRoll: { sides: 6, count: 3, target: 15 },
                    successNode: 'trial_complete',
                    failNode: 'trial_failed'
                },
                {
                    id: 'defensive_stance',
                    text: 'Take a defensive stance (🛡️ Roll 2d8 DC 13)',
                    diceRoll: { sides: 8, count: 2, target: 13 },
                    successNode: 'trial_complete',
                    failNode: 'trial_failed'
                }
            ]
        },

        book_trial: {
            id: 'book_trial',
            title: 'Trial of Knowledge',
            text: `You enter a library filled with ancient tomes. A spectral figure appears: "Answer my riddle to pass: I have cities but no houses, forests but no trees, and water but no fish. What am I?"`,
            choices: [
                {
                    id: 'answer_map',
                    text: 'Answer: "A map!"',
                    nextNode: 'trial_complete'
                },
                {
                    id: 'answer_book',
                    text: 'Answer: "A book!"',
                    nextNode: 'trial_failed'
                },
                {
                    id: 'answer_mind',
                    text: 'Answer: "The mind!"',
                    nextNode: 'trial_failed'
                }
            ]
        },

        cultist_confrontation: {
            id: 'cultist_confrontation',
            title: 'Face to Face',
            text: `You burst through the dragon door to find three cultists in dark robes attempting to breach the vault. They spin around, surprised!

"Another fool seeking the Eye!" their leader snarls. "You'll not interfere with Tiamat's will!"`,
            choices: [
                {
                    id: 'intimidate',
                    text: 'Intimidate them (💪 Charisma check DC 15)',
                    skillCheck: { skill: 'charisma', difficulty: 15 },
                    successNode: 'cultists_flee',
                    failNode: 'cultist_fight'
                },
                {
                    id: 'attack',
                    text: 'Attack immediately! (⚔️ Roll 2d8 DC 14)',
                    diceRoll: { sides: 8, count: 2, target: 14 },
                    successNode: 'cultist_defeated',
                    failNode: 'cultist_fight'
                },
                {
                    id: 'reason',
                    text: 'Try to reason with them (🗣️ Wisdom check DC 16)',
                    skillCheck: { skill: 'wisdom', difficulty: 16 },
                    successNode: 'cultists_doubt',
                    failNode: 'cultist_fight'
                }
            ]
        },

        learn_secret: {
            id: 'learn_secret',
            title: 'Knowledge is Power',
            text: `You hide in the shadows and listen carefully. The cultists reveal that the vault requires three keys: the Sword of Truth, the Book of Ages, and the Dragon's Scale. They only have one!

"We must find the other two," their leader says. "Search the trial chambers!"

They split up, leaving the vault unguarded temporarily.`,
            effects: { setFlag: { key: 'knows_vault_secret', value: true } },
            choices: [
                {
                    id: 'vault_directly',
                    text: 'Go to the vault while they search (🎯 Requires all three keys)',
                    requires: { flag: 'has_all_keys' },
                    nextNode: 'vault_chamber'
                },
                {
                    id: 'collect_keys',
                    text: 'Quickly collect the keys from the trials',
                    nextNode: 'collect_keys_quest'
                }
            ]
        },

        caught_listening: {
            id: 'caught_listening',
            title: 'Discovered!',
            text: `Your hiding spot isn't as good as you thought. One of the cultists spots you!

"Intruder!" they shout. The cultists prepare to attack!`,
            choices: [
                {
                    id: 'fight_cultists',
                    text: 'Fight them! (⚔️ Roll 2d8 DC 14)',
                    diceRoll: { sides: 8, count: 2, target: 14 },
                    successNode: 'cultist_defeated',
                    failNode: 'cultist_fight'
                },
                {
                    id: 'flee_trials',
                    text: 'Flee to the trial chambers',
                    nextNode: 'inner_chambers'
                }
            ]
        },

        trial_complete: {
            id: 'trial_complete',
            title: 'Trial Passed',
            text: `The spectral figures fade away, and a pedestal rises from the floor. Upon it rests a key radiating magical energy. You've proven yourself worthy!`,
            effects: { 
                setFlag: { key: 'has_trial_key', value: true },
                addItem: 'trial_key'
            },
            choices: [
                {
                    id: 'return',
                    text: 'Return to the main chamber',
                    nextNode: 'after_trials'
                }
            ]
        },

        trial_failed: {
            id: 'trial_failed',
            title: 'Trial Failed',
            text: `The magic rejects you, and you're forcefully ejected from the chamber. You'll need to try a different approach.`,
            choices: [
                {
                    id: 'try_another',
                    text: 'Try another door',
                    nextNode: 'inner_chambers'
                }
            ]
        },

        cultists_flee: {
            id: 'cultists_flee',
            title: 'Intimidation Success',
            text: `Your powerful presence and fierce words shake their resolve! "T-this isn't worth it!" one stammers. They flee in different directions, leaving behind their research notes and a partial key!`,
            effects: { 
                setFlag: { key: 'cultists_defeated', value: true },
                addItem: 'cultist_key'
            },
            choices: [
                {
                    id: 'examine_notes',
                    text: 'Examine their notes',
                    nextNode: 'learn_vault_direct'
                }
            ]
        },

        cultists_doubt: {
            id: 'cultists_doubt',
            title: 'Seeds of Doubt',
            text: `Your words about the true nature of Tiamat's worship reach one of the younger cultists. "Wait... is this truly the path?" they question. In the confusion, you see an opening!`,
            choices: [
                {
                    id: 'press_advantage',
                    text: 'Press your advantage (💬 Charisma check DC 13)',
                    skillCheck: { skill: 'charisma', difficulty: 13 },
                    successNode: 'cultists_flee',
                    failNode: 'cultist_fight'
                },
                {
                    id: 'attack_now',
                    text: 'Attack while they\'re divided (⚔️ Roll 2d6 DC 11)',
                    diceRoll: { sides: 6, count: 2, target: 11 },
                    successNode: 'cultist_defeated',
                    failNode: 'cultist_fight'
                }
            ]
        },

        cultist_fight: {
            id: 'cultist_fight',
            title: 'Desperate Battle',
            text: `The cultists attack with dark magic and blades! It's a fierce battle.`,
            choices: [
                {
                    id: 'all_out',
                    text: 'All-out attack! (⚔️ Roll 3d6 DC 16)',
                    diceRoll: { sides: 6, count: 3, target: 16 },
                    successNode: 'cultist_defeated',
                    failNode: 'battle_wounded'
                },
                {
                    id: 'tactical',
                    text: 'Fight tactically (🎲 Roll 2d8 DC 14)',
                    diceRoll: { sides: 8, count: 2, target: 14 },
                    successNode: 'cultist_defeated',
                    failNode: 'battle_wounded'
                }
            ]
        },

        cultist_defeated: {
            id: 'cultist_defeated',
            title: 'Victory Over Evil',
            text: `The cultists fall! As the last one collapses, you find a journal describing the vault mechanism and a partial key. The path to the Eye of Bahamut is clear!`,
            effects: { 
                setFlag: { key: 'cultists_defeated', value: true },
                addItem: 'cultist_key'
            },
            choices: [
                {
                    id: 'read_journal',
                    text: 'Read the journal',
                    nextNode: 'learn_vault_direct'
                }
            ]
        },

        battle_wounded: {
            id: 'battle_wounded',
            title: 'Wounded but Alive',
            text: `The battle goes poorly. You're wounded and forced to retreat. The cultists give chase, but you manage to lose them in the twisting corridors.

You find yourself in an ancient healing chamber. Murals show Bahamut healing wounded warriors.`,
            choices: [
                {
                    id: 'rest',
                    text: 'Rest and heal (✨ Wisdom check DC 10)',
                    skillCheck: { skill: 'wisdom', difficulty: 10 },
                    successNode: 'healed',
                    failNode: 'rest_basic'
                },
                {
                    id: 'use_scroll',
                    text: 'Use healing scroll',
                    requires: { item: 'healing_scroll' },
                    effects: { removeItem: 'healing_scroll' },
                    nextNode: 'healed'
                }
            ]
        },

        healed: {
            id: 'healed',
            title: 'Restored',
            text: `You feel the ancient magic of Bahamut flow through you, healing your wounds. Your determination is renewed! You must find another way to the vault.`,
            choices: [
                {
                    id: 'continue',
                    text: 'Continue your quest',
                    nextNode: 'inner_chambers'
                }
            ]
        },

        rest_basic: {
            id: 'rest_basic',
            title: 'Brief Rest',
            text: `You rest as best you can. Your wounds are still there, but you can continue. The quest is too important to give up now.`,
            choices: [
                {
                    id: 'continue',
                    text: 'Continue despite your wounds',
                    nextNode: 'inner_chambers'
                }
            ]
        },

        collect_keys_quest: {
            id: 'collect_keys_quest',
            title: 'The Three Keys',
            text: `You rush to gather the keys from the trial chambers before the cultists return. You'll need to be quick!`,
            choices: [
                {
                    id: 'start_collecting',
                    text: 'Begin collecting (🎲 Luck check DC 13)',
                    skillCheck: { skill: 'luck', difficulty: 13 },
                    successNode: 'keys_collected',
                    failNode: 'keys_partial'
                }
            ]
        },

        keys_collected: {
            id: 'keys_collected',
            title: 'All Keys Obtained',
            text: `You move swiftly through the chambers, solving the trials and collecting all three keys: the Sword of Truth, the Book of Ages, and the Dragon's Scale. The cultists return just as you grab the last one!`,
            effects: { 
                setFlag: { key: 'has_all_keys', value: true },
                addItem: 'all_keys'
            },
            choices: [
                {
                    id: 'race_vault',
                    text: 'Race to the vault!',
                    nextNode: 'vault_race'
                },
                {
                    id: 'confront',
                    text: 'Confront the cultists',
                    nextNode: 'cultist_confrontation'
                }
            ]
        },

        keys_partial: {
            id: 'keys_partial',
            title: 'Race Against Time',
            text: `You manage to collect two keys, but the cultists return before you can get the third! You'll need to either fight them or find another way.`,
            effects: { addItem: 'two_keys' },
            choices: [
                {
                    id: 'fight_for_key',
                    text: 'Fight for the final key',
                    nextNode: 'cultist_fight'
                },
                {
                    id: 'alternative',
                    text: 'Look for an alternative (🔍 Wisdom check DC 14)',
                    skillCheck: { skill: 'wisdom', difficulty: 14 },
                    successNode: 'bypass_discovered',
                    failNode: 'cultist_fight'
                }
            ]
        },

        learn_vault_direct: {
            id: 'learn_vault_direct',
            title: 'The Vault Awaits',
            text: `According to the notes, the vault door responds to those of pure intent who bear a key. The cultists' key alone wasn't enough—they needed three. But perhaps with your pure intentions, one key will suffice?`,
            effects: { setFlag: { key: 'understands_vault', value: true } },
            choices: [
                {
                    id: 'try_vault',
                    text: 'Approach the vault',
                    nextNode: 'vault_chamber'
                }
            ]
        },

        after_trials: {
            id: 'after_trials',
            title: 'Path Clear',
            text: `Having completed a trial, you return to find the cultists have fled or been defeated. The path to the vault lies open.`,
            choices: [
                {
                    id: 'enter_vault',
                    text: 'Enter the vault',
                    nextNode: 'vault_chamber'
                }
            ]
        },

        vault_race: {
            id: 'vault_race',
            title: 'The Final Sprint',
            text: `You sprint toward the vault with the cultists in hot pursuit! You reach the door first and insert the three keys. The door begins to open!

"Stop them!" the cultist leader screams.`,
            choices: [
                {
                    id: 'hold_door',
                    text: 'Hold them off while door opens (⚔️ Roll 2d8 DC 13)',
                    diceRoll: { sides: 8, count: 2, target: 13 },
                    successNode: 'vault_entry',
                    failNode: 'vault_struggle'
                },
                {
                    id: 'slip_inside',
                    text: 'Slip inside quickly (🎲 Luck check DC 12)',
                    skillCheck: { skill: 'luck', difficulty: 12 },
                    successNode: 'vault_entry',
                    failNode: 'vault_struggle'
                }
            ]
        },

        vault_struggle: {
            id: 'vault_struggle',
            title: 'Struggle at the Threshold',
            text: `You and the cultists struggle at the vault entrance! In the chaos, you both tumble through as the door seals behind you. Now you must face them in the vault itself!`,
            choices: [
                {
                    id: 'final_fight',
                    text: 'Final confrontation (⚔️ Roll 3d6 DC 15)',
                    diceRoll: { sides: 6, count: 3, target: 15 },
                    successNode: 'vault_victory',
                    failNode: 'vault_desperate'
                }
            ]
        },

        bypass_discovered: {
            id: 'bypass_discovered',
            title: 'Ancient Secret',
            text: `Your wisdom reveals an ancient bypass—a servant's passage used by the original keepers! You can reach the vault through a different route.`,
            choices: [
                {
                    id: 'use_bypass',
                    text: 'Use the secret passage',
                    nextNode: 'vault_chamber'
                }
            ]
        },

        vault_chamber: {
            id: 'vault_chamber',
            title: 'The Vault of Bahamut',
            text: `You stand in a magnificent chamber. At its center, on a platinum pedestal, rests the Eye of Bahamut—a perfect sapphire that pulses with inner light. Murals of the platinum dragon cover every wall.

As you approach, a spectral form of Bahamut himself appears!

"Seeker," the dragon's voice resonates, "why do you claim this treasure?"`,
            choices: [
                {
                    id: 'truth_justice',
                    text: 'To stop evil and protect the innocent',
                    nextNode: 'bahamut_approves'
                },
                {
                    id: 'for_wizard',
                    text: 'A wizard sent me to retrieve it',
                    nextNode: 'bahamut_tests'
                },
                {
                    id: 'for_power',
                    text: 'For the power it contains',
                    nextNode: 'bahamut_refuses'
                }
            ]
        },

        vault_entry: {
            id: 'vault_entry',
            title: 'Inside the Vault',
            text: `You make it inside! The door seals behind you, leaving the cultists locked out. You hear their frustrated shouts fade as you turn to face the vault's interior.

The Eye of Bahamut awaits on its pedestal, and the spectral form of the platinum dragon appears before you.`,
            choices: [
                {
                    id: 'approach',
                    text: 'Approach the dragon spirit',
                    nextNode: 'vault_chamber'
                }
            ]
        },

        vault_victory: {
            id: 'vault_victory',
            title: 'Cultists Defeated',
            text: `In the sacred vault, your resolve proves stronger! The cultists fall, and their dark magic dissipates. Bahamut's spirit appears, nodding approvingly at your prowess.`,
            choices: [
                {
                    id: 'speak_bahamut',
                    text: 'Speak with Bahamut',
                    nextNode: 'bahamut_approves'
                }
            ]
        },

        vault_desperate: {
            id: 'vault_desperate',
            title: 'Desperate Gambit',
            text: `The fight turns against you! In desperation, you call out to Bahamut for aid. The spirit of the platinum dragon appears, its presence overwhelming!

"Enough!" Bahamut's voice thunders. The cultists freeze, paralyzed by divine power.`,
            choices: [
                {
                    id: 'thank_bahamut',
                    text: 'Thank Bahamut for intervention',
                    nextNode: 'bahamut_tests'
                }
            ]
        },

        bahamut_approves: {
            id: 'bahamut_approves',
            title: 'Blessing of the Platinum Dragon',
            text: `Bahamut's spirit glows warmly. "You possess a righteous heart, brave adventurer. You may take the Eye, but know this—it will reveal truth wherever you go. Are you prepared for the burden of seeing the world as it truly is?"`,
            choices: [
                {
                    id: 'accept_burden',
                    text: 'Accept the burden',
                    nextNode: 'true_hero_ending'
                },
                {
                    id: 'ask_guidance',
                    text: 'Ask for Bahamut\'s guidance',
                    nextNode: 'guided_hero_ending'
                }
            ]
        },

        bahamut_tests: {
            id: 'bahamut_tests',
            title: 'The Dragon\'s Test',
            text: `"You speak of duty to another," Bahamut observes. "But what is your true intention? Look into the Eye and tell me what you see."

You gaze into the sapphire and see reflections of your choices throughout this journey.`,
            choices: [
                {
                    id: 'honest',
                    text: 'Be completely honest about your motives',
                    nextNode: 'bahamut_approves'
                },
                {
                    id: 'selfless',
                    text: 'Focus on helping others',
                    nextNode: 'worthy_ending'
                }
            ]
        },

        bahamut_refuses: {
            id: 'bahamut_refuses',
            title: 'Unworthy',
            text: `Bahamut's form darkens. "You seek power for its own sake. This is not the path of righteousness. The Eye shall remain here until one truly worthy arrives."

The chamber begins to collapse! You must flee empty-handed, the quest incomplete.`,
            choices: [
                {
                    id: 'flee',
                    text: 'Escape the collapsing vault',
                    nextNode: 'failed_ending'
                },
                {
                    id: 'beg_forgiveness',
                    text: 'Beg Bahamut for forgiveness (💬 Charisma check DC 18)',
                    skillCheck: { skill: 'charisma', difficulty: 18 },
                    successNode: 'redemption_chance',
                    failNode: 'failed_ending'
                }
            ]
        },

        redemption_chance: {
            id: 'redemption_chance',
            title: 'Second Chance',
            text: `Your heartfelt plea touches something within the dragon's spirit. "Perhaps... there is yet hope for you. But you must prove your change of heart through deeds, not words."

Bahamut grants you a quest to redeem yourself.`,
            choices: [
                {
                    id: 'accept_redemption',
                    text: 'Accept the redemption quest',
                    nextNode: 'redemption_ending'
                }
            ]
        },

        true_hero_ending: {
            id: 'true_hero_ending',
            title: 'True Hero',
            text: `Bahamut nods with deep approval. "You understand. Take the Eye, and use it wisely."

You claim the Eye of Bahamut. As you return to the wizard, you find you can now see through lies and illusions. The wizard is true to his word—he's been protecting the Eye from those who would misuse it.

Your adventure has made you a true hero, blessed by the Platinum Dragon himself!

🎉 ENDING ACHIEVED: The True Hero 🎉`,
            isEnding: true,
            choices: [
                {
                    id: 'restart',
                    text: '↻ Play Again',
                    nextNode: 'start'
                }
            ]
        },

        guided_hero_ending: {
            id: 'guided_hero_ending',
            title: 'Chosen of Bahamut',
            text: `"Wisdom to seek guidance—this pleases me," Bahamut says warmly. "I shall not merely grant you the Eye, but also my blessing. Go forth as my champion."

You become a paladin of Bahamut, wielding both the Eye and the dragon's divine power. The wizard is overjoyed, and you begin a new life as a force for good in the world.

🎉 ENDING ACHIEVED: Chosen of Bahamut 🎉`,
            isEnding: true,
            choices: [
                {
                    id: 'restart',
                    text: '↻ Play Again',
                    nextNode: 'start'
                }
            ]
        },

        worthy_ending: {
            id: 'worthy_ending',
            title: 'Worthy Bearer',
            text: `"Your heart is true," Bahamut declares. "You may bear the Eye, but remember—power without wisdom is dangerous."

You return to the wizard with the Eye. He uses it to root out corruption in the kingdom, and you're celebrated as a hero. Your selfless actions have changed many lives for the better!

🎉 ENDING ACHIEVED: The Worthy Bearer 🎉`,
            isEnding: true,
            choices: [
                {
                    id: 'restart',
                    text: '↻ Play Again',
                    nextNode: 'start'
                }
            ]
        },

        failed_ending: {
            id: 'failed_ending',
            title: 'Quest Failed',
            text: `You barely escape the collapsing vault with your life. The Eye of Bahamut is lost, buried under tons of rubble.

You return to the wizard empty-handed. He's disappointed but notes that you survived, which is something. Perhaps one day you'll be ready for such a quest...

💔 ENDING: Failed Quest 💔`,
            isEnding: true,
            choices: [
                {
                    id: 'restart',
                    text: '↻ Try Again',
                    nextNode: 'start'
                }
            ]
        },

        redemption_ending: {
            id: 'redemption_ending',
            title: 'Path of Redemption',
            text: `Bahamut grants you a second chance. Though you cannot take the Eye now, you're given a quest to prove your worthiness. You embark on a journey to right wrongs and help the innocent.

Over time, your actions prove your transformation. Years later, you return to find the Eye waiting for you—Bahamut kept his promise.

🎉 ENDING ACHIEVED: Redemption 🎉`,
            isEnding: true,
            choices: [
                {
                    id: 'restart',
                    text: '↻ Play Again',
                    nextNode: 'start'
                }
            ]
        },

        refuse_ending: {
            id: 'refuse_ending',
            title: 'A Quiet Life',
            text: `You decide adventure isn't for you after all. You finish your ale and return to your simple life. Sometimes the greatest adventure is knowing when to stay home.

🏠 ENDING: The Quiet Life 🏠`,
            isEnding: true,
            choices: [
                {
                    id: 'restart',
                    text: '↻ Try a Different Path',
                    nextNode: 'start'
                }
            ]
        }
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.dragonsDilemmaStory = dragonsDilemmaStory;
}
