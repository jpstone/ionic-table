# Introduction

Ionic directives (ion-list, ion-item) styled to mimick normal HTML tables for responsiveness and provide animation functionality.

## Codepen Demo

http://codepen.io/anon/pen/QjWxqG

# Installation

bower install ionic-table

# Usage

Include the ionic-table.js in your index.html file and be sure to inject "ionic-table" into your app.js.

# Markup

Below is a markup example in Jade:

```
ion-header-bar.bar-positive
  h1.title Table
ion-content
  .table(ion-table='')
    ion-list
      ion-item.table-head.table-row
        ul
          li One
          li Two
          li Three
      ion-item.table-row
        ul
          li
            | The li element will automatically resize to fit the data here as best as possible.
          li.table-select
            select
              option(disabled, selected) Chose
              option Yes
              option No
              option N/A
          li.table-select
            select
              option(disabled, selected) Choose
              option Yes
              option No
              option N/A
      ion-item.table-row
        ul
          li
            | More data
          li.table-select
            select
              option(disabled, selected) Chooooose
              option Yes
              option No
              option N/A
          li.table-select
            select
              option(disabled, selected) Choose
              option Yes
              option No
              option N/A
```