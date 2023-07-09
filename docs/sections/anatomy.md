---
previous: %autolinks%
tags: [section, advanced]
---
# Anatomy

The anatomy of a metatable reflects the hierarchical recursive structure found in YAML.

Example: [[examples/anatomy]]

![[anatomy.png]]

## Root

The root part (gold) as its name suggests is a wrapper around the whole metatable section, including its label.

Note that the metatable is expected to start as a [[#Set]] but technically speaking it can be anything YAML allows for.


## Set

The set part (light pink) wraps a set of [[#Member]] parts.


## Member

The member part (brown) wraps a pair of [[#Key]], [[#Value]] parts.


## Key

The key part (sky blue) contains the label of a set member.

When the [[#Value]] contains either a [[#Set]] or a [[#List]], the key also includes a `toggle` part as well as either `expanded` or `collapsed`.
 

## Value

The value part (light blue) contains the value of a set member. It can contain either a scalar value (string, number, null, date, boolean) or a collection ([[#Set]], [[#List]]).

Whe the value is a collection it also contains a _marker_ which is expected to be displayed when the key toggle is collapsed.


## List

The list part (light pink) wraps a set of [[#List item]] parts.


## List item

The list item part (deep pink) behaves like the [[#Value]] part.


## Tag

A tag part contains the text for the given tag. See [[sections/tags]] for a more in depth explanation of the particularities of tags.